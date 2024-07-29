"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Plus, Edit } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import convert24HourTo12Hour from "@/lib/convert24HourTo12Hour";
import { DeleteEventDialog } from "./DeleteEventDialog";

type Props = {
	organisationInformation: any;
};

const SeeDashboard = (props: Props) => {
	const [view, setView] = useState<"event" | "group">("event");

	const switchToEventView = () => {
		setView("event");
	};

	const switchToGroupView = () => {
		setView("group");
	};

	return (
		<>
			<div className="flex justify-center flex-row mt-5 space-x-4">
				<motion.div
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={switchToEventView}
					className={`cursor-pointer flex flex-col items-center ${
						view === "event" ? "text-primary" : "text-gray-500"
					}`}
				>
					<Calendar size={24} />
					<span className="ml-2">Events </span>
				</motion.div>
				<div className="mx-2"></div>
				<motion.div
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={switchToGroupView}
					className={`cursor-pointer flex flex-col items-center ${
						view === "group" ? "text-primary" : "text-gray-500"
					}`}
				>
					<Users size={24} />
					<span className="ml-2">Groups</span>
				</motion.div>
			</div>
			<div className="mt-4">
				{view === "group" ? (
					<h1>Groups</h1>
				) : (
					<div>
						<h2 className="text-xl font-semibold mb-4 text-primary">
							Your Events
						</h2>

						<div className="my-6">
							<Link href="/createEvent">
								<Button className="bg-green-500 hover:bg-green-600">
									<Plus className="mr-2" /> Create Event
								</Button>
							</Link>
						</div>

						{props.organisationInformation.events &&
						props.organisationInformation.events.length > 0 ? (
							<div className="space-y-4">
								{props.organisationInformation.events.map(
									(eve: any) => (
										<motion.div
											key={eve._id}
											className="p-4 border rounded-lg shadow-md"
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.3 }}
										>
											<div className="flex flex-col md:flex-row md:justify-between">
												<div>
													<h3 className="text-lg font-medium text-primary">
														{eve.title}
													</h3>
													<p className="text-justify truncate">
														{eve.description.length > 50
															? `${eve.description.substring(
																	0,
																	50
															  )}...`
															: eve.description}
													</p>
													<p className="text-gray-500 flex items-center mt-2">
														<Calendar className="mr-1" />
														{new Date(eve.date).toDateString()}
													</p>
													<p className="text-gray-500 flex items-center mt-1">
														{convert24HourTo12Hour(eve.startTime)}{" "}
														- {convert24HourTo12Hour(eve.endTime)}
													</p>
												</div>

												<div className="flex flex-col gap-3 mt-4">
													<Link href={`/editEvent/${eve.id}`}>
														<Button className="w-full">
															<Edit className="mr-2" /> Edit
														</Button>
													</Link>
													<DeleteEventDialog eventId={eve.id} />
												</div>
											</div>
										</motion.div>
									)
								)}
							</div>
						) : (
							<p className="text-gray-500">No events available.</p>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default SeeDashboard;
