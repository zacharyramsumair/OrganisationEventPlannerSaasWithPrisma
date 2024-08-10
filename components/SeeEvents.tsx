"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EventsList from '@/components/EventsList';
import { ShowCalendar } from '@/components/ui/showCalendar';
import { Calendar, List } from 'lucide-react';
import { Button } from './ui/button';


interface SeeEventsProps {
  organisationUsername?: string;
  groupJoincode?: string;
}

const SeeEvents: React.FC<SeeEventsProps> = ({ organisationUsername, groupJoincode }) => {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const switchToCalendarView = () => {
    setView('calendar');
  };

  const switchToListView = () => {
    setView('list');
  };

  console.log("groupjoincode", groupJoincode);
  console.log("organisationusername", organisationUsername);

  return (
    <>
      <div className='flex justify-center flex-row mt-5 space-x-4'>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={switchToCalendarView}
          className={`cursor-pointer flex flex-col items-center ${view === 'calendar' ? 'text-primary' : 'text-gray-500'}`}
        >
          <Calendar size={24} />
          <span className='ml-2'>Calendar</span>
        </motion.div>
        <div className="mx-2"></div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={switchToListView}
          className={`cursor-pointer flex flex-col items-center ${view === 'list' ? 'text-primary' : 'text-gray-500'}`}
        >
          <List size={24} />
          <span className='ml-2'>List</span>
        </motion.div>
      </div>
      <div className='mt-4'>
        {view === 'calendar' ? <ShowCalendar organisationUsername={organisationUsername} groupJoincode={groupJoincode} /> : <EventsList organisationUsername={organisationUsername} groupJoincode={groupJoincode} />}
      </div>
    </>
  );
};

export default SeeEvents;