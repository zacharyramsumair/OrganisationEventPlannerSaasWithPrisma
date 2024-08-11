"use client"
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { DatePicker } from "./ui/date-picker";
import TimePicker from "./TimePicker";
import { getAllEventsForSpecificDate, createEvent} from "@/actions/event";
import { SelectGroupCombobox } from "./SelectGroupCombobox";

type Props = {
    currentUser: any,
    groupsForCombobox: any
};

const FormSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: "Title must be at least 2 characters.",
        })
        .max(100, {
            message: "Title must be max 100 characters.",
        }),
    description: z.string().max(500, {
        message: "Description must be max 500 characters.",
    }),
    location: z
        .string()
        .max(75, {
            message: "Location must be max 50 characters.",
        }),
});

const EventForm = ({ currentUser, groupsForCombobox }: Props) => {
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [date, setDate] = useState(null);
    const [occupied, setOccupied] = useState([]);
    const [isTimePickerEnabled, setIsTimePickerEnabled] = useState(false);
    const [groupValue, setGroupValue] = useState("#$%none");

    const router = useRouter();

    useEffect(() => {
        setIsTimePickerEnabled(date !== null);
        setStartTime(null);
        setEndTime(null);

        if (date && date!== null) {
            fetchOccupiedTimes(date, groupValue);
        }
    }, [date]); // 

    const fetchOccupiedTimes = async (selectedDate: any, groupValue: any) => {
        try {
            const events: any = await getAllEventsForSpecificDate(selectedDate, groupValue, currentUser);
            let occupiedTimes = events.map((event: any) => ({
                startTime: event.startTime,
                endTime: event.endTime
            }));

            if (events.length === 0) {
                occupiedTimes = [{
                    startTime: null,
                    endTime: null
                }];
            }

            setOccupied(occupiedTimes);
        } catch (error) {
            console.error("Error fetching events for date:", error);
            setOccupied([]);
        }
    };

    const changeValueTotalFunction = async (value: any) => {
        await setGroupValue(value);
        fetchOccupiedTimes(date, value);
    }

    if (currentUser.organisations.length === 0) {
        toast({
            title: "Create an Organisation",
            description: "Create an Organisation in order to set Events",
        });
        router.push("/createOrganisation");
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            description: "",
            location: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (date === null || startTime === null || endTime === null) {
            toast({
                title: "Missing Values",
                description: "Please select a date, start and end time"
            });
        } else {
            const formData = { ...data, date, startTime, endTime, organisation: currentUser.organisations[0].id };

            await createEvent(formData);
            router.push("/dashboard");

            toast({
                title: "New Event Created",
                description: "If you don't see it, refresh the page to see it on your dashboard"
            });
        }
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-xl p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Create Event
                    </motion.span>
                </h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex items-center">
                                            <Calendar size={20} className="mr-2" />
                                            Title <span className="text-red-500">*</span>
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="General Meeting" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex items-center">
                                            <AlertCircle size={20} className="mr-2" />
                                            Description
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Small Description of your event" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <span className="flex items-center">
                                            <MapPin size={20} className="mr-2" />
                                            Location
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Amphitheatre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel >
                                <span className="flex items-center">
                                    <Calendar size={20} className="mr-2" />
                                    Date <span className="text-red-500">*</span>
                                </span>
                            </FormLabel>
                            <div className="mt-2">
                                <DatePicker date={date} setDate={setDate} />
                            </div>
                        </div>

                        <div>
                            <FormLabel >
                                <span className="flex items-center">
                                    Check for clashes with other events 
                                </span>
                            </FormLabel>
                            <div className="mt-2">
                                <SelectGroupCombobox value={groupValue} setValue={setGroupValue} changeValueTotalFunction={changeValueTotalFunction} groupsForCombobox={groupsForCombobox} />
                            </div>
                        </div>

                        <div>
                            <FormLabel>
                                <span className="flex items-center">
                                    <Clock size={20} className="mr-2" />
                                    Start Time and End Time <span className="text-red-500">*</span>
                                </span>
                            </FormLabel>
                            <TimePicker
                                occupiedTimes={occupied}
                                startTime={startTime}
                                setStartTime={setStartTime}
                                endTime={endTime}
                                setEndTime={setEndTime}
                                disabled={!isTimePickerEnabled} // Disable TimePicker if date is not selected
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex items-center justify-center space-x-2"
                            >
                                <span>Submit</span>
                            </motion.div>
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default EventForm;
