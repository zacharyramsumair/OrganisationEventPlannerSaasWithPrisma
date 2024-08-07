"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Edit, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteEventDialog } from "./DeleteEventDialog";
import convert24HourTo12Hour from "@/lib/convert24HourTo12Hour";
import SeeDashboard from "./SeeDashboard";

type Props = {
  organisationInformation: any;
  currentUser:any;
};

const Dashboard = (props: Props) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Dashboard</h1>

      {props.organisationInformation && (
        <>
          <div className="mb-6 p-4 border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-primary">
              Organisation: {props.organisationInformation.name}
            </h2>
            <p className="mb-4">Username: @{props.organisationInformation.username}</p>
            <p className="mb-2 text-justify">
              Description: {props.organisationInformation.description || "N/A"}
            </p>
            <p className="mb-2">Email: {props.organisationInformation.email || "N/A"}</p>
            <p className="mb-2">Contact Number: {props.organisationInformation.contactNumber || "N/A"}</p>
            <Link href={`/editOrganisation`}>
              <Button className="mt-4 bg-primary hover:bg-indigo-700">
                <Edit className="mr-2" /> Edit Organisation
              </Button>
            </Link>
          </div>

          {/* <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Your Events</h2>

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
                {props.organisationInformation.events.map((eve: any) => (
                  <motion.div
                    key={eve._id}
                    className="p-4 border rounded-lg shadow-md"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-primary">{eve.title}</h3>
                      <p className="text-justify truncate">
                          {eve.description.length > 50 ? `${eve.description.substring(0, 50)}...` : eve.description}
                        </p>
                      <p className="text-gray-500 flex items-center mt-2">
                        <Calendar className="mr-1" />
                        {new Date(eve.date).toDateString()}
                      </p>
                      <p className="text-gray-500 flex items-center mt-1">
                        {convert24HourTo12Hour(eve.startTime)} - {convert24HourTo12Hour(eve.endTime)}
                      </p>
                    </div>

                      <div className="flex flex-col gap-3 mt-4">
                        <Link href={`/editEvent/${eve.id}`}>
                          <Button className="w-full">
                            <Edit className="mr-2" /> Edit
                          </Button>
                        </Link>
                        <DeleteEventDialog eventId={eve.id}/>
                     
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events available.</p>
            )}
          </div> */}


<SeeDashboard organisationInformation={props.organisationInformation} currentUser={props.currentUser} />

        </>
      )}
    </div>
  );
};

export default Dashboard;