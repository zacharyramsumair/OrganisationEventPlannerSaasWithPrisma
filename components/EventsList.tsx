"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Importing Chevron icons
import { toast } from "@/components/ui/use-toast";
import { EventListTable } from "./EventListTable";
import { getAllEventsForTheYear } from "@/actions/event";

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  host: string;
  organisation: string;
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);

  const fetchEventsForMonth = async (year: number, month: number) => {
    try {
      const fetchedEvents = await getAllEventsForTheYear(year);
      const filteredEvents:any = fetchedEvents.filter(event => new Date(event.date).getMonth() + 1 === month);
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events for the selected month.",
      });
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  useEffect(() => {
    fetchEventsForMonth(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h1 className="md:text-3xl text-lg font-bold mb-4 p-2  rounded-lg inline-block">
          <ChevronLeft onClick={handlePreviousMonth} className="cursor-pointer inline-block" /> 
          Events for {new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })} 
          <ChevronRight onClick={handleNextMonth} className="cursor-pointer inline-block" />
        </h1>
        {events.length > 0 ? (
          <EventListTable events={events}/>
        ) : (
          <h3>No events carded for this month.</h3>
        )}
      </div>
    </div>
  );
};

export default EventsList;