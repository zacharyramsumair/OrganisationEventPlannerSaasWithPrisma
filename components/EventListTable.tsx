import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import convert24HourTo12Hour from "@/lib/convert24HourTo12Hour";
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, Clock, Star } from 'lucide-react';

export function EventListTable({ events }: any) {
  return (
    <div className="overflow-x-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Table className="min-w-full bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Event</TableHead>
              <TableHead className="text-left hidden sm:table-cell">Host</TableHead>
              <TableHead className="text-left hidden md:table-cell">Location</TableHead>
              <TableHead className="text-left">Date</TableHead>
              <TableHead className="text-left">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event:any) => (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TableCell className="text-left">
                  <div className="flex items-center space-x-2">
                    <Star className="flex-shrink-0 h-5 w-5 text-primary" />
                    <span className="whitespace-pre-wrap break-words">{event.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-left hidden sm:table-cell">
                  <div className="flex items-center ">
                    <User className="flex-shrink-0 h-5 w-5 text-primary mr-2" />
                    <span>{event.host}</span>
                  </div>
                </TableCell>
                <TableCell className="text-left hidden md:table-cell">
                  <div className="flex items-center ">
                    <MapPin className="flex-shrink-0 h-5 w-5 text-primary mr-2" />
                    <span>{event.location || "TBA"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex items-center ">
                    <Calendar className="flex-shrink-0 h-5 w-5 text-primary hidden md:block mr-2" />
                    <span>{format(new Date(event.date), "EEEE do MMMM, yyyy")}</span>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex items-center ">
                    <Clock className="flex-shrink-0 h-5 w-5 text-primary hidden md:block mr-2" />
                    <span>{convert24HourTo12Hour(event.startTime)} - {convert24HourTo12Hour(event.endTime)}</span>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}