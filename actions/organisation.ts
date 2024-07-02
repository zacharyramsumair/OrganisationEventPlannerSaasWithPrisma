"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const isOrganisationUsernameUnique = async (username: string) => {
  const organisation = await prisma.organisation.findUnique({
    where: { username: username.toLowerCase() },
  });

  return !organisation; // Returns true if username is unique, false otherwise
};

const createOrganisation = async (formData: any, currentUser: any) => {
  const { name, description, contactNumber, email, organisationMainUser, username } = formData;

  console.log("here organ", organisationMainUser)
console.log("here 1")
  try {
    // Check if the organisation username is unique
    const isUnique = await isOrganisationUsernameUnique(username);
    console.log("here 1.5")

    if (!currentUser) {
        console.log("here 2")
      throw new Error("Not Authenticated");
    }

    if (!isUnique) {
        console.log("here 2")
      throw new Error("Organisation username is already taken. Please choose a different username.");
    }

    // let currentUser = await getCurrentUser();
    console.log("here 2.5")


    if (currentUser?.organisations?.length > 0) {
        console.log("here 3")
      throw new Error("Only allowed One Organisation per account. Upgrade to create more");
    }


    console.log("here 3.5")

    const newOrganisation = await prisma.organisation.create({
      data: {
        name,
        description,
        contactNumber,
        email,
        organisationMainUser: { connect: { id: organisationMainUser } },
        username: username.toLowerCase(),
      },
    });


    console.log("here 4")
    // Update the current user's organisations array
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        organisations: {
          connect: { id: newOrganisation?.id },
        },
      },
    });

    console.log("here 5")

    return newOrganisation;
  } catch (error: any) {

    console.log("here 6")
    console.log(error.message);
    throw new Error("Error while creating Organisation");
  }
};

const getOrganisationById = async (organisationId: string) => {
  try {
    const organisation = await prisma.organisation.findUnique({
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

    return organisation;
  } catch (error: any) {
    console.log("here we are", error.message);
    throw new Error("Error while fetching Organisation");
  }
};

const getOrganisationByIdWithoutPopulatedEvents = async (organisationId: string) => {
  try {
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      throw new Error("Organisation not found");
    }

    return organisation;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Error while fetching Organisation");
  }
};

const updateOrganisation = async (organisationId: string, updateData: any) => {
  try {
    const updatedOrganisation = await prisma.organisation.update({
      where: { id: organisationId },
      data: updateData,
    });

    if (!updatedOrganisation) {
      throw new Error("Organisation not found");
    }

    return updatedOrganisation;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Error while updating Organisation");
  }
};

export { createOrganisation, isOrganisationUsernameUnique, getOrganisationById, getOrganisationByIdWithoutPopulatedEvents, updateOrganisation };
