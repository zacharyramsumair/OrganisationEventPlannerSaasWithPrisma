"use client"
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion"; // For animations
import { Calendar, ChevronRight } from "lucide-react"; // Lucide React icons
import StarsCanvas from "./StarBackground";

function HomePage({ currentUser }: any) {

// copied from
	// https://www.youtube.com/watch?v=RiUh_8VTGYM
	// Build & Deploy AI Resume Builder App Using React, Vite, Tailwind css, Strapi, Clerk
	// TubeGuruji

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen flex-col"
    >

      <StarsCanvas/>
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <Link
          href="/calendar"
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <span className="text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3">
            New
          </span>{" "}
          <span className="text-sm font-medium">
            Visualise Events on a Calendar
          </span>
          <Calendar className="ml-2 w-5 h-5" strokeWidth={2} />
        </Link>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Engage your Audience With <span className="text-primary">U</span>Events
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          Effortlessly Craft a Calendar of Events with Our Application
        </p>
        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">

        {!currentUser && <Link
            href="/login"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Get Started
            <ChevronRight className="ml-2 -mr-1 w-5 h-5" strokeWidth={2} />
          </Link>
          }

        {currentUser && (currentUser?.organisations.length ==0 ||!currentUser?.organisations) && <Link
            href="/createOrganisation"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Get Started
            <ChevronRight className="ml-2 -mr-1 w-5 h-5" strokeWidth={2} />
          </Link>
          }

         {currentUser && currentUser?.organisations.length >0 && <Link
            href="/dashboard"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Dashboard
            <ChevronRight className="ml-2 -mr-1 w-5 h-5" strokeWidth={2} />
          </Link>
          }
        </div>
      </div>
    </motion.section>
  );
}

export default HomePage;