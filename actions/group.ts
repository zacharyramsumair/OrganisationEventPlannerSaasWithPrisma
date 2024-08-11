"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { v4 as uuidv4 } from "uuid";
import { getOrganisationByIdWithoutPopulatedEvents } from "./organisation";

type Error = any;

const generateRandomCode = (length: number) => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return result;
};

const createGroup = async (formData: any) => {
	const { name, description, image, adminOrganisationId } = formData;

	try {
		// Generate UUID for joinId and random 10-letter string for joincode
		const joincode = uuidv4();
		const secret = generateRandomCode(10);

		// Create a new group
		const newGroup = await db.group.create({
			data: {
				joincode,
				secret,
				name,
				description: description || "",
				image: image || "",
				adminOrganisationIds: [adminOrganisationId],
				organisations: [adminOrganisationId],
			},
		});

		// Fetch the current organisation
		const organisation = await db.organisation.findUnique({
			where: { id: adminOrganisationId },
		});

		if (!organisation) {
			throw new Error("Organisation not found");
		}

		// Push the new group ID to the end of the groups array
		const updatedGroups = organisation.groups
			? [...organisation.groups, newGroup.id]
			: [newGroup.id];

		// Update the organisation with the new groups array
		await db.organisation.update({
			where: { id: adminOrganisationId },
			data: {
				groups: updatedGroups,
			},
		});

		revalidatePath("/dashboard");
		return newGroup;
	} catch (error) {
		console.error("Error while creating group:", error.message);
		throw new Error("Error while creating group");
	}
};

const joinGroup = async (groupId: string, organisationId: string) => {
	try {
		const group = await db.group.findUnique({
			where: { id: groupId },
		});

		if (!group) {
			throw new Error("Group not found");
		}

		const organisation = await db.organisation.findUnique({
			where: { id: organisationId },
		});

		if (!organisation) {
			throw new Error("Organisation not found");
		}

		// Add the organisation to the group
		const updatedGroup = await db.group.update({
			where: { id: groupId },
			data: {
				organisations: [...group.organisations, organisationId],
			},
		});

		//add group to organisation
		const updatedOrganisation = await db.organisation.update({
			where: { id: organisationId },
			data: {
				groups: [...organisation.groups, groupId],
			},
		});

		revalidatePath(`/group/${group.joincode}`);
		return updatedGroup;
	} catch (error) {
		console.error("Error while joining group:", error.message);
		throw new Error("Error while joining group");
	}
};

const leaveGroup = async (groupId: string, organisationId: string) => {
	try {
		const group = await db.group.findUnique({
			where: { id: groupId },
		});

		if (!group) {
			throw new Error("Group not found");
		}

		const organisation = await db.organisation.findUnique({
			where: { id: organisationId },
		});

		if (!organisation) {
			throw new Error("Organisation not found");
		}

		//remove group from organisation

		let newGroupList = organisation.groups;

		const indexOfGroup = newGroupList.indexOf(groupId);
		if (indexOfGroup > -1) {
			// only splice array when item is found
			newGroupList.splice(indexOfGroup, 1); // 2nd parameter means remove one item only
		}

		//remove organisation from group

		let newOrganisationList = group.organisations;

		const indexOfOrganisation = newOrganisationList.indexOf(organisationId);
		if (indexOfOrganisation > -1) {
			// only splice array when item is found
			newOrganisationList.splice(indexOfOrganisation, 1); // 2nd parameter means remove one item only
		}

		// Add the organisation to the group
		const updatedGroup = await db.group.update({
			where: { id: groupId },
			data: {
				organisations: newOrganisationList,
			},
		});

		//add group to organisation
		const updatedOrganisation = await db.organisation.update({
			where: { id: organisationId },
			data: {
				groups: newGroupList,
			},
		});

		revalidatePath(`/dashboard`);
		return updatedGroup;
	} catch (error) {
		console.error("Error while leaving group:", error.message);
		throw new Error("Error while joining group");
	}
};

const removeOrganisationFromGroup = async (
	currentUser: any,
	groupId: string,
	organisationId: string
) => {
	try {
		console.log("here 13");

		const group = await db.group.findUnique({
			where: { id: groupId },
		});

		console.log("here 14");

		if (!group) {
			throw new Error("Group not found");
		}

		console.log("here 11");

		//check if user is admin of this group

		if (
			!group.adminOrganisationIds.includes(currentUser.organisations[0].id)
		) {
			console.log("here 10");

			throw new Error("Organisation not a group admin");
		}

		console.log("here 1");

		const organisation = await db.organisation.findUnique({
			where: { id: organisationId },
		});

		if (!organisation) {
			throw new Error("Organisation not found");
		}

		console.log("here 2");
		//remove group from organisation

		let newGroupList = organisation.groups;

		const indexOfGroup = newGroupList.indexOf(groupId);
		if (indexOfGroup > -1) {
			// only splice array when item is found
			newGroupList.splice(indexOfGroup, 1); // 2nd parameter means remove one item only
		}

		console.log("here 3");

		//remove organisation from group

		let newOrganisationList = group.organisations;

		const indexOfOrganisation = newOrganisationList.indexOf(organisationId);
		if (indexOfOrganisation > -1) {
			// only splice array when item is found
			console.log("here 4");
			newOrganisationList.splice(indexOfOrganisation, 1); // 2nd parameter means remove one item only
		}

		// Add the organisation to the group
		const updatedGroup = await db.group.update({
			where: { id: groupId },
			data: {
				organisations: newOrganisationList,
			},
		});

		console.log("here 5");
		//add group to organisation
		const updatedOrganisation = await db.organisation.update({
			where: { id: organisationId },
			data: {
				groups: newGroupList,
			},
		});

		console.log("here 6");

		revalidatePath(`/group/${group.joincode}`);
		return updatedGroup;
	} catch (error) {
		console.log("here 7");
		console.error(
			"Error while removing organisation from  group:",
			error.message
		);
		throw new Error("Error while removing organisation from group");
	}
};

const getGroupByJoincode = async (joincode: string) => {
	try {
		// Fetch the group by its ID
		const group = await db.group.findUnique({
			where: { joincode },
		});

		if (!group) {
			return false;
		}

		// Use Promise.all to wait for all async operations to complete
		const groupOrganisations = await Promise.all(
			group.organisations.map(async (organisationId: string) => {
				let organisation = await getOrganisationByIdWithoutPopulatedEvents(
					organisationId
				);
				return organisation;
			})
		);

		return { ...group, groupOrganisations };
	} catch (error) {
		console.error("Error while fetching group:", error.message);
		return false;
	}
};

const getAllEventsForGroupForYear = async (year: number, joincode: string) => {
	try {
	  const group = await db.group.findUnique({
		where: { joincode },
	  });
  
	  if (!group) {
		return false;
	  }
  
	  let groupEvents: any = [];
  
	  const organisationPromises = group.organisations.map(async (organisationId) => {
		const organisation = await db.organisation.findUnique({
		  where: { id: organisationId },
		  include: {
			events: {
			  orderBy: { updatedAt: "desc" },
			},
		  },
		});
  
		if (!organisation) {
		  throw new Error("Organisation not found");
		}
  
		groupEvents.push(...organisation.events);
	  });
  
	  // Wait for all organisationPromises to resolve
	  await Promise.all(organisationPromises);
  
	  console.log("group events 2", groupEvents);
  
	  const filteredEvents = groupEvents.filter((event: any) => {
		const eventDate = new Date(event.date);
		return eventDate.getFullYear() === year;
	  });
  
	  return filteredEvents;
	} catch (error) {
	  console.error("Error while fetching group events:", error.message);
	  return false;
	}
  };



const getAllGroupsForOrganisation = async ( currentUser: any) => {
	try {
	 
		const organisation = await db.organisation.findUnique({
			where: { id: currentUser.organisations[0].id },
		});

		if (!organisation) {
			throw new Error("Organisation not found");
		}
  
	  let groups: any = [];
  
	  const groupPromises = organisation.groups.map(async (groupId) => {
		const group = await db.group.findUnique({
		  where: { id: groupId },
		  select: { name: true,  joincode: true },
		});
  
		if (!group) {
		  throw new Error("group not found");
		}
  
		groups.push(group);
	  });
  
	  // Wait for all groupPromises to resolve
	  await Promise.all(groupPromises);
  
  
	  return groups;
  
	} catch (error) {
	  console.error("Error while fetching group events:", error.message);
	  return false;
	}
  };
  

export {
	createGroup,
	joinGroup,
	leaveGroup,
	getGroupByJoincode,
	removeOrganisationFromGroup,
	getAllEventsForGroupForYear,
	getAllGroupsForOrganisation
};
