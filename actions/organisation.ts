"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";


const isOrganisationUsernameUnique = async (username: string) => {
	const organisation = await db.organisation.findUnique({
		where: { username: username.toLowerCase() },
	});

	return !organisation; // Returns true if username is unique, false otherwise
};

const createOrganisation = async (formData: any, currentUser: any) => {
	const {
		name,
		description,
		contactNumber,
		viewMoreLink,
		email,
		organisationMainUser,
		username,
	} = formData;

	try {
		// Check if the organisation username is unique
		const isUnique = await isOrganisationUsernameUnique(username);

		if (!currentUser) {
			throw new Error("Not Authenticated");
		}

		if (!isUnique) {
			throw new Error(
				"Organisation username is already taken. Please choose a different username."
			);
		}

		// let currentUser = await getCurrentUser();

		if (currentUser?.organisations?.length > 0) {
			throw new Error(
				"Only allowed One Organisation per account. Upgrade to create more"
			);
		}

		const newOrganisation = await db.organisation.create({
			data: {
				name,
				description,
				contactNumber,
				email,
				viewMoreLink,
				organisationMainUser: { connect: { id: organisationMainUser } },
				username: username.toLowerCase(),
			},
		});

		// Update the current user's organisations array
		await db.user.update({
			where: { id: currentUser.id },
			data: {
				organisations: {
					connect: { id: newOrganisation?.id },
				},
			},
		});

		revalidatePath("/dashboard");

		return newOrganisation;
	} catch (error:any) {
		console.log(error.message);
		throw new Error("Error while creating Organisation");
	}
};

const getOrganisationById = async (organisationId: any) => {
	try {
		const organisation = await db.organisation.findUnique({
			where: { id: organisationId.id },
			include: {
				events: {
					orderBy: { updatedAt: "desc" },
				},
			},
		});

		if (!organisation) {
			throw new Error("Organisation not found");
		}


		const groups = await db.group.findMany({
			where: { id: { in: organisation.groups } },
			select: {
				id: true,
				name: true,
				description: true,
				joincode: true,
				secret: true,
				adminOrganisationIds: true,
			},
		});


		return {...organisation, infoForGroups: groups};
	} catch (error) {
		throw new Error("Error while fetching Organisation");
	}
};

const getOrganisationByIdWithoutPopulatedEvents = async (
	organisationId: any
) => {
	try {
		const organisation = await db.organisation.findUnique({
			where: { id: organisationId },
		});

		if (!organisation) {
			throw new Error("Organisation not found");
		}

		return organisation;
	} catch (error:any) {
		console.log(error.message);
		throw new Error("Error while fetching Organisation");
	}
};

const updateOrganisation = async (
	organisationId: string,
	updateData: any,
	currentUser: any
) => {
	try {
		const isOrganisationOwnedByUser = currentUser.organisations.some(
			(org: any) => org.id === organisationId
		);

		if (!isOrganisationOwnedByUser) {
			throw new Error("User does not own this organisation");
		}

		const updatedOrganisation = await db.organisation.update({
			where: { id: organisationId },
			data: updateData,
		});

		if (!updatedOrganisation) {
			throw new Error("Organisation not found");
		}
		revalidatePath("/dashboard");

		return updatedOrganisation;
	} catch (error:any) {
		console.log(error.message);
		throw new Error("Error while updating Organisation");
	}
};

export {
	createOrganisation,
	isOrganisationUsernameUnique,
	getOrganisationById,
	getOrganisationByIdWithoutPopulatedEvents,
	updateOrganisation,
};
