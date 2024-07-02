"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, Plus } from 'lucide-react'; // Lucide icons
import { Button } from './ui/button';
import convert24HourTo12Hour from "@/lib/convert24HourTo12Hour";


const generateTimeIntervals = () => {
  const intervals = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      intervals.push(time);
    }
  }
  return intervals;
};

const TimePicker = ({ occupiedTimes, startTime, endTime, setStartTime, setEndTime, disabled }:any) => {
  const intervals = generateTimeIntervals();
  
  const [hoveredTime, setHoveredTime] = useState(null);
  const [customOccupiedSlots, setCustomOccupiedSlots] = useState<any>([]);

  useEffect(() => {
    // Calculate custom occupied slots when occupiedTimes prop changes
    if (occupiedTimes && occupiedTimes.length > 0) {
      const calculatedOccupiedSlots:any = calculateOccupiedSlots(occupiedTimes);
      setCustomOccupiedSlots(calculatedOccupiedSlots);
    }
  }, [occupiedTimes]);

  const handleTimeClick = (time:any) => {
    if (disabled) return; // Prevent click actions if disabled

    if (!startTime || (startTime && endTime)) {
      setStartTime(time);
      setEndTime(null);
      setHoveredTime(null);
    } else if (startTime && !endTime) {
      if (time >= startTime) {
        setEndTime(time);
      } else {
        setStartTime(time);
      }
      setHoveredTime(null);
    }
  };

  const handleTimeMouseEnter = (time:any) => {
    if (disabled) return; // Prevent hover actions if disabled

    if (startTime && !endTime) {
      setHoveredTime(time);
    }
  };

  const handleTimeMouseLeave = () => {
    if (disabled) return; // Prevent hover actions if disabled

    setHoveredTime(null);
  };

  const isHighlighted = (time:any) => {
    if (startTime && endTime) {
      return time >= startTime && time <= endTime;
    }
    return false;
  };

  const isFaded = (time:any) => {
    if (startTime && !endTime && hoveredTime) {
      return time >= startTime && time <= hoveredTime;
    }
    return false;
  };

  const isMixed = (time:any) => {
    if (customOccupiedSlots.length > 0 && (startTime && endTime)) {
      return time >= startTime && time <= endTime && customOccupiedSlots.includes(time);
    }
    return false;
  };

  const submitInfo = () => {
    const duration = calculateDuration();
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);
    console.log("Duration:", duration, "minutes");
  };

  const calculateOccupiedSlots = (occupiedTimes:any) => {
    const slots:any = [];
    occupiedTimes.forEach(({ startTime, endTime }:any) => {
        if (startTime && endTime) { // Add a check to ensure startTime and endTime are not null
            const startHour = parseInt(startTime.split(':')[0]);
            const startMinute = parseInt(startTime.split(':')[1]);
            const endHour = parseInt(endTime.split(':')[0]);
            const endMinute = parseInt(endTime.split(':')[1]);
            for (let hour = startHour; hour <= endHour; hour++) {
                for (let minute = 0; minute < 60; minute += 15) {
                    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    if ((hour === startHour && minute >= startMinute) || 
                        (hour > startHour && hour < endHour) || 
                        (hour === endHour && minute <= endMinute)) {
                        slots.push(time);
                    }
                }
            }
        }
    });
    return slots;
  };

  const calculateDuration = () => {
    if (startTime && endTime) {
      const start:any = new Date(`2000-01-01T${startTime}`);
      const end:any = new Date(`2000-01-01T${endTime}`);
      const duration = (end - start) / (1000 * 60); // Duration in minutes
      return duration;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-4 gap-2 p-2">
      {intervals.map((time) => (
        <motion.div
          key={time}
          className={`flex items-center justify-center p-2 border cursor-pointer select-none rounded-md
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            ${isMixed(time) ? 'bg-purple-300' : (time === startTime || time === endTime || isHighlighted(time)) ? 'bg-green-500' : isFaded(time) ? 'bg-green-300' : (customOccupiedSlots.includes(time)) ? 'bg-red-300' : '' }
            hover:bg-green-500`}
          onClick={() => handleTimeClick(time)}
          onMouseEnter={() => handleTimeMouseEnter(time)}
          onMouseLeave={handleTimeMouseLeave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <span className="flex items-center space-x-1">
            <Clock size={18} className="hidden md:block" />
            <span className="text-sm md:text-base">{convert24HourTo12Hour(time)}</span>
            {/* <span>{time}</span> */}
            {customOccupiedSlots.includes(time) && <AlertCircle size={18} className="text-red-600 hidden md:block" />}
          </span>
        </motion.div>
      ))}

      {/* <Button onClick={submitInfo} className="col-span-4">
        <span className="flex items-center space-x-1">
          <Plus size={18} />
          <span>Submit</span>
        </span>
      </Button> */}
    </div>
  );
};

export default TimePicker;