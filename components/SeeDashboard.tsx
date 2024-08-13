"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Plus, Edit, Copy } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import convert24HourTo12Hour from "@/lib/convert24HourTo12Hour";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { toast } from "@/components/ui/use-toast";

type Props = {
  organisationInformation: any;
  currentUser: any;
};

const SeeDashboard = (props: Props) => {
  const [view, setView] = useState<"event" | "group">("event");

  const switchToEventView = () => {
    setView("event");
  };

  const switchToGroupView = () => {
    setView("group");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Invite URL copied to clipboard",
          description: "Share this with others to invite them to your group",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-5">
        <Button
          variant={view === "event" ? "default" : "outline"}
          onClick={switchToEventView}
          className="mx-2"
        >
          <Calendar size={24} /> &nbsp;
          Events
        </Button>
        <Button
          variant={view === "group" ? "default" : "outline"}
          onClick={switchToGroupView}
          className="mx-2"
        >
          <Users size={24} /> &nbsp;
          Groups
        </Button>
      </div>

      {/* View Content */}
      <div className="mt-4">
        {view === "group" ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Your Groups
            </h2>
            <div className="my-6 flex justify-center md:justify-start">
    <Link href="/createGroup">
        <Button className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
            <Plus className="mr-2" /> Create Group
        </Button>
    </Link>
</div>

            {props.organisationInformation.infoForGroups &&
            props.organisationInformation.infoForGroups.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {props.organisationInformation.infoForGroups.map(
                  (group: any) => (
                    <Link
                      key={group.id}
                      href={`/group/${group.joincode}`}
                      passHref
                    >
                      <motion.div
                        className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <h3 className="text-lg font-medium text-primary">
                              {group.name}
                            </h3>
                            <p className="text-justify truncate mt-2">
                              {group.description?.length > 50
                                ? `${group.description.substring(0, 50)}...`
                                : group.description}
                            </p>
                          </div>
                          {group.adminOrganisationIds.includes(
                            props.currentUser?.organisations[0].id
                          ) && (
                            <Button
                              className="mt-4"
                              onClick={(e) => {
                                e.preventDefault();
                                copyToClipboard(
                                  `${window.location.origin}/group/${group.joincode}?secret=${group.secret}`
                                );
                              }}
                            >
                              <Copy className="mr-2" /> Copy URL
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500">
                This Organisation is not a part of any group.
              </p>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Your Events
            </h2>
			<div className="my-6 flex justify-center md:justify-start">
    <Link href="/createEvent">
        <Button className="bg-green-500 hover:bg-green-600 w-full md:w-auto">
            <Plus className="mr-2" /> Create Event
        </Button>
    </Link>
</div>

            {props.organisationInformation.events &&
            props.organisationInformation.events.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {props.organisationInformation.events.map((eve: any) => (
                  <motion.div
                    key={eve._id}
                    className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-lg font-medium text-primary">
                          {eve.title}
                        </h3>
                        <p className="text-justify truncate mt-2">
                          {eve.description?.length > 50
                            ? `${eve.description.substring(0, 50)}...`
                            : eve.description}
                        </p>
                        <p className="text-gray-500 flex items-center mt-2">
                          <Calendar className="mr-1" />
                          {new Date(eve.date).toDateString()}
                        </p>
                        <p className="text-gray-500 flex items-center mt-1">
                          {convert24HourTo12Hour(eve.startTime)} -{" "}
                          {convert24HourTo12Hour(eve.endTime)}
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
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events available.</p>
            )}
          </div>
        )}
     
      </div>
    </div>
  );
};

export default SeeDashboard;
