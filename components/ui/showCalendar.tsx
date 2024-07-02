import * as React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { EventCard } from "../EventCard";
import { getAllEventsForTheYear } from "@/actions/event";


export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function ShowCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [eventDates, setEventDates] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getAllEventsForTheYear(currentYear);
        const parsedEvents:any = events.map(event => ({
          ...event,
          date: new Date(event.date)
        }));
        setEventDates(parsedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to fetch events for the year.",
        });
      }
    };

    fetchEvents();
  }, [currentYear]);

  const isEventDate = (date: Date) =>
    eventDates.some(
      (event:any) =>
        date.getDate() === event?.date.getDate() &&
        date.getMonth() === event?.date.getMonth() &&
        date.getFullYear() === event?.date.getFullYear()
    );

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
    setCurrentYear(month.getFullYear());
  };

  const CustomDay = ({ date, selected, className, ...props }:any) => {
    const isEvent = isEventDate(date);

    const handleClick = () => {
      const events = eventDates.filter(
        (event:any) =>
          date.getDate() === event?.date.getDate() &&
          date.getMonth() === event?.date.getMonth() &&
          date.getFullYear() === event?.date.getFullYear()
      );
      setSelectedEvents(events);
    };

    return (
        // this is the squares when there is an event
      <motion.div
        {...props}
        className={cn(
          "relative",
          className,
          isEvent
            ? "bg-primary text-primary-foreground cursor-pointer rounded-full"
            : "cursor-default"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
      >
        {date.getDate()}
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto p-4 flex flex-col justify-start items-center min-h-screen md:min-h-min">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row w-full max-w-6xl justify-center bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg p-6"
      >
        <div className="w-full lg:w-1/2 px-2 md:p-4 flex justify-center calendarSection">
          <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("", className)}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "h-9 w-9 text-center text-sm p-0 relative",
                "[&:has([aria-selected].day-range-end)]:rounded-r-md",
                "[&:has([aria-selected].day-outside)]:bg-accent/50",
                "[&:has([aria-selected])]:bg-accent",
                "first:[&:has([aria-selected])]:rounded-l-md",
                "last:[&:has([aria-selected])]:rounded-r-md",
                "focus-within:relative focus-within:z-20"
              ),
              day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
              ),
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
              ...classNames,
            }}
            components={{
              IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
              IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
              Day: CustomDay,
            }}
            onMonthChange={handleMonthChange}
            {...props}
          />
        </div>

        <div className="w-full lg:w-1/2 p-2 md:p-4 eventSection flex flex-col justify-center items-center">
          <h2 className="text-lg font-extrabold my-2 flex items-center">
            <CalendarIcon className="mr-2 h-6 w-6 text-primary" />
            Events
          </h2>
          {selectedEvents.length > 0 ? (
            <motion.ul
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className=""
            >
              {selectedEvents.map((event: any, index: any) => (
                <motion.div
                  key={event._id}
                  className="mb-3"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.ul>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center"
            >
              No events for this date.
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

ShowCalendar.displayName = "ShowCalendar";

export { ShowCalendar };