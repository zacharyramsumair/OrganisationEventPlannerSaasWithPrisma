"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";

type Error = any;

const createEvent = async (formData: any) => {
  const {
    title,
    description,
    image,
    date,
    startTime,
    endTime,
    location,
    organisation,
  } = formData;

  try {
    // Find the organisation by ID
    const organisationDetails = await db.organisation.findUnique({
      where: { id: organisation },
    });

    if (!organisationDetails) {
      throw new Error("Organisation not found");
    }

    let newEvent = await db.event.create({
      data: {
        title,
        description,
        image: image || "",
        date,
        startTime,
        endTime,
        location,
        host: organisationDetails.name,
        organisation: { connect: { id: organisation } },
      },
    });

    revalidatePath("/dashboard");
    return newEvent;
  } catch (error: Error) {
    console.log(error.message);
    throw new Error("Error while creating event");
  }
};

const getAllEventsForTheYear = async (year: number) => {
  try {
    // Fetch all events and filter by the specified year
    const events = await db.event.findMany();
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year;
    });

    return filteredEvents;
  } catch (error: Error) {
    console.log(error.message);
    throw new Error("Error while fetching events");
  }
};

const getAllEventsForSpecificDate = async (date: any) => {
  try {
    // Parse the provided date string
    const targetDate = new Date(date);

    // Fetch all events and filter by the specified date
    const events = await db.event.findMany();
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === targetDate.getFullYear() &&
        eventDate.getMonth() === targetDate.getMonth() &&
        eventDate.getDate() === targetDate.getDate()
      );
    });

    return filteredEvents;
  } catch (error: Error) {
    console.log(error.message);
    throw new Error("Error while fetching events");
  }
};

const getAllEventsForOrganisation = async (organisationId: string) => {
  try {
    // Fetch all events for the given organisation
    const events = await db.event.findMany({
      where: { organisationId },
    });

    return events;
  } catch (error: Error) {
    console.log(error.message);
    throw new Error("Error while fetching events");
  }
};

const getAllEventsForTheYearForOrganisation = async (year: number, organisationUsername: string) => {
  try {
    // Fetch organisation by username
    const organisation = await db.organisation.findUnique({
      where: { username: organisationUsername },
    });

    if (!organisation) {
      throw new Error("Organisation not found");
    }

    // Fetch all events for the organisation and filter by the specified year
    const events = await db.event.findMany({
      where: { organisationId: organisation.id },
    });

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year;
    });

    return filteredEvents;
  } catch (error: Error) {
    console.log(error.message);
    throw new Error("Error while fetching events for organisation");
  }
};

const getAllEventsForTheYearForGroup = async (year: number, groupId: string) => {
  return [];
  // try {
  //   // Fetch all events for the given group
  //   const events = await db.event.findMany({
  //     where: { groupId },
  //   });

  //   const filteredEvents = events.filter((event) => {
  //     const eventDate = new Date(event.date);
  //     return eventDate.getFullYear() === year;
  //   });

  //   return filteredEvents;
  // } catch (error: Error) {
  //   console.log(error.message);
  //   throw new Error("Error while fetching events for group");
  // }
};

const getEventById = async (eventId: string) => {
  try {
    // Find the event by its ID
    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    // If event is not found, throw an error
    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  } catch (error: Error) {
    console.error("Error while fetching event by ID:", error.message);
    throw new Error("Error while fetching event");
  }
};

const editEvent = async (eventId: string, formData: any, currentUser: any) => {
  try {
    if (currentUser?.organisations.length === 0) {
      throw new Error("You must be an organisation to edit an event");
    }
    if (currentUser.organisations[0].id != formData.organisation) {
      throw new Error("Don't have permission to edit this event");
    }

    // Find and update the event by its ID
    const updatedEvent = await db.event.update({
      where: { id: eventId },
      data: {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
      },
    });

    revalidatePath("/dashboard");

    return updatedEvent;
  } catch (error: Error) {
    console.error("Error while editing event:", error.message);
    throw new Error("Error while editing event");
  }
};

const deleteEvent = async (eventId: string) => {
  try {
    // Find the event by its ID
    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    // If event is not found, throw an error
    if (!event) {
      throw new Error("Event not found");
    }

    // Remove the event reference from the organisation's events array
    // await db.organisation.update({
    //   where: { id: event.organisationId },
    //   data: {
    //     events: {
    //       disconnect: { id: eventId },
    //     },
    //   },
    // });

    // Remove the event from the database
    await db.event.delete({
      where: { id: eventId },
    });

    revalidatePath("/dashboard");

    return { message: "Event deleted successfully" };
  } catch (error: Error) {
    console.error("Error while deleting event:", error.message);
    throw new Error("Error while deleting event");
  }
};

const getOrganisationByUsername = async (organisationUsername: string) => {
	try {
	  // Fetch organisation by username
	  const organisation = await db.organisation.findUnique({
		where: { username: organisationUsername },
		select: { name: true, username: true },
	  });
  
	  if (!organisation) {
		throw new Error("Organisation not found");
	  }
  
	  return organisation;
	} catch (error: Error) {
	  console.error("Error while fetching organisation by username:", error.message);
	  throw new Error("Error while fetching organisation");
	}
  };
  

export {
  createEvent,
  getAllEventsForTheYear,
  getAllEventsForTheYearForOrganisation,
  getAllEventsForTheYearForGroup,
  getAllEventsForSpecificDate,
  getAllEventsForOrganisation,
  getEventById,
  editEvent,
  deleteEvent,
  getOrganisationByUsername,
};
