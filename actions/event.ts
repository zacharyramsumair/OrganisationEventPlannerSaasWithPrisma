"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createEvent = async (formData: any) => {
  const { title, description, image, date, startTime, endTime, location, organisation } = formData;

  try {
    // Find the organisation by ID
    const organisationDetails = await prisma.organisation.findUnique({
      where: { id: organisation },
    });
    if (!organisationDetails) {
      throw new Error("Organisation not found");
    }

    let newEvent = await prisma.event.create({
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

    return newEvent;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Error while creating event");
  }
};

const getAllEventsForTheYear = async (year: number) => {
  try {
    // Fetch all events and filter by the specified year
    const events = await prisma.event.findMany();
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year;
    });

    return filteredEvents;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Error while fetching events");
  }
};

const getAllEventsForSpecificDate = async (date: string) => {
  try {
    // Parse the provided date string
    const targetDate = new Date(date);

    // Fetch all events and filter by the specified date
    const events = await prisma.event.findMany();
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === targetDate.getFullYear() &&
        eventDate.getMonth() === targetDate.getMonth() &&
        eventDate.getDate() === targetDate.getDate()
      );
    });

    return filteredEvents;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Error while fetching events");
  }
};

const getAllEventsForOrganisation = async (organisationId: string) => {
  try {
    // Fetch all events for the given organisation
    const events = await prisma.event.findMany({
      where: { organisationId },
    });

    return events;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Error while fetching events");
  }
};

const getEventById = async (eventId: string) => {
  try {
    // Find the event by its ID
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    // If event is not found, throw an error
    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  } catch (error: any) {
    console.error("Error while fetching event by ID:", error.message);
    throw new Error("Error while fetching event");
  }
};

const editEvent = async (eventId: string, formData: any) => {
  try {
    // Find and update the event by its ID
    const updatedEvent = await prisma.event.update({
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

    return updatedEvent;
  } catch (error: any) {
    console.error("Error while editing event:", error.message);
    throw new Error("Error while editing event");
  }
};

const deleteEvent = async (eventId: string) => {
  try {
    // Find the event by its ID
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    // If event is not found, throw an error
    if (!event) {
      throw new Error("Event not found");
    }

    // Remove the event reference from the organisation's events array
    await prisma.organisation.update({
      where: { id: event.organisationId },
      data: {
        events: {
          disconnect: { id: eventId },
        },
      },
    });

    // Remove the event from the database
    await prisma.event.delete({
      where: { id: eventId },
    });

    return { message: "Event deleted successfully" };
  } catch (error: any) {
    console.error("Error while deleting event:", error.message);
    throw new Error("Error while deleting event");
  }
};

export { createEvent, getAllEventsForTheYear, getAllEventsForSpecificDate, getAllEventsForOrganisation, getEventById, editEvent, deleteEvent };
