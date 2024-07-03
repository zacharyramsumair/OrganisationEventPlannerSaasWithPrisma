import { BellRing, Calendar, MapPin, User, Clock } from "lucide-react";
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import convert24HourTo12Hour from "@/lib/convert24HourTo12Hour";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EventCard({ className, event, ...props }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(" bg-white dark:bg-gray-800 shadow-lg rounded-lg", className)} {...props}>
        <CardHeader className="flex flex-col space-y-2">
          <CardTitle className="flex items-center space-x-2">
            <BellRing className="h-5 w-5 text-primary" />
            <span>{event.title}</span>
          </CardTitle>
          <CardDescription>{event.description}</CardDescription>
          <CardDescription className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Hosted by: {event.host}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {event.location && (
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Location: {event.location}</p>
              </div>
            </div>
          )}
          <div className="flex items-start space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Date: {format(new Date(event.date), "EEEE do MMMM, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">
                <Clock className="inline h-4 w-4 mr-1" />
                {convert24HourTo12Hour(event.startTime)} - {convert24HourTo12Hour(event.endTime)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}