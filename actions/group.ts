"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { v4 as uuidv4 } from 'uuid';

type Error = any;

const generateRandomCode = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const createGroup = async (formData: any) => {
  const { name, description, image, adminOrganisationId } = formData;

  try {
    // Generate UUID for joinId and random 10-letter string for joincode
    const joinId = uuidv4();
    const joincode = generateRandomCode(10);

    // Create a new group
    const newGroup = await db.group.create({
      data: {
        joinId,
        joincode,
        name,
        description: description || "",
        image: image || "",
        adminOrganisationId,
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
    const updatedGroups = organisation.groups ? [...organisation.groups, newGroup.id] : [newGroup.id];

    // Update the organisation with the new groups array
    await db.organisation.update({
      where: { id: adminOrganisationId },
      data: {
        groups: updatedGroups,
      },
    });

    revalidatePath("/dashboard");
    return newGroup;
  } catch (error: Error) {
    console.error("Error while creating group:", error.message);
    throw new Error("Error while creating group");
  }
};

const joinGroup = async (groupId: string, organisationId: string) => {
  try {
    // Add the organisation to the group
    const updatedGroup = await db.group.update({
      where: { id: groupId },
      data: {
        organisations: {
          connect: { id: organisationId },
        },
      },
    });

    revalidatePath("/groups");
    return updatedGroup;
  } catch (error: Error) {
    console.error("Error while joining group:", error.message);
    throw new Error("Error while joining group");
  }
};

const leaveGroup = async (groupId: string, organisationId: string) => {
  try {
    // Remove the organisation from the group
    const updatedGroup = await db.group.update({
      where: { id: groupId },
      data: {
        organisations: {
          disconnect: { id: organisationId },
        },
      },
    });

    revalidatePath("/groups");
    return updatedGroup;
  } catch (error: Error) {
    console.error("Error while leaving group:", error.message);
    throw new Error("Error while leaving group");
  }
};

const deleteGroup = async (groupId: string) => {
  try {
    // Find and delete the group by its ID
    await db.group.delete({
      where: { id: groupId },
    });

    revalidatePath("/groups");

    return { message: "Group deleted successfully" };
  } catch (error: Error) {
    console.error("Error while deleting group:", error.message);
    throw new Error("Error while deleting group");
  }
};



export {
  createGroup,
  joinGroup,
  leaveGroup,
  deleteGroup,
  
};
