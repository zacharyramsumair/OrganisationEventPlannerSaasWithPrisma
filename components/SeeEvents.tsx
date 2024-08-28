"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import EventsList from "@/components/EventsList";
import { ShowCalendar } from "@/components/ui/showCalendar";
import { Calendar, List } from "lucide-react";
import { Button } from "./ui/button";
import { SelectGroupCombobox } from "./SelectGroupCombobox";

interface SeeEventsProps {
	organisationUsername?: string;
	groupJoincode?: string;
	groupsForCombobox?: any;
	currentUser?: any;
}

const SeeEvents: React.FC<SeeEventsProps> = ({
	organisationUsername,
	groupJoincode,
	groupsForCombobox,
	currentUser,
}) => {
	const [view, setView] = useState<"calendar" | "list">("calendar");
	const [groupValue, setGroupValue] = useState("#$%everyone");

	const changeValueTotalFunction = async (value: any) => {
		await setGroupValue(value);
	};

	const switchToCalendarView = () => {
		setView("calendar");
	};

	const switchToListView = () => {
		setView("list");
	};

	console.log("groupjoincode", groupJoincode);
	console.log("organisationusername", organisationUsername);

	return (
		<>
			<div className="flex flex-col lg:flex-row lg:justify-center lg:space-x-4 mt-5">
				{groupsForCombobox && currentUser && (
					<motion.div
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={switchToCalendarView}
						className="cursor-pointer flex flex-col items-center text-primary w-full mb-4 lg:mb-0 lg:w-auto"
					>
						<SelectGroupCombobox
							value={groupValue}
							setValue={setGroupValue}
							changeValueTotalFunction={changeValueTotalFunction}
							groupsForCombobox={groupsForCombobox}
						/>
					</motion.div>
				)}

				<div className="flex justify-center space-x-4">
					<motion.div
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={switchToCalendarView}
						className={`cursor-pointer flex flex-col items-center ${
							view === "calendar" ? "text-primary" : "text-gray-500"
						}`}
					>
						<Calendar size={24} />
						<span className="ml-2">Calendar</span>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={switchToListView}
						className={`cursor-pointer flex flex-col items-center ${
							view === "list" ? "text-primary" : "text-gray-500"
						}`}
					>
						<List size={24} />
						<span className="ml-2">List</span>
					</motion.div>
				</div>
			</div>

			<div className="mt-4">
				{view === "calendar" ? (
					<ShowCalendar
						organisationUsername={organisationUsername}
						groupJoincode={groupJoincode}
						groupValue={groupValue}
						currentUser={currentUser}
					/>
				) : (
					<EventsList
						organisationUsername={organisationUsername}
						groupJoincode={groupJoincode}
						groupValue={groupValue}
						currentUser={currentUser}
					/>
				)}
			</div>
		</>
	);
};

export default SeeEvents;
