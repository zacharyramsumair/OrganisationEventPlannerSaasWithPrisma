"use client";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Router } from "next/router";
import { useRouter } from "next/navigation";



const NotFoundButton = () => {
    const router = useRouter();

	return (
		<div
			
			className=" hover:cursor-pointer relative group/btn flex  items-center justify-center   text-black rounded-md h-10 font-medium   "
		>
			{/* <FaGoogle  /> */}

            <Button onClick={() =>{
                router.push("/")
            }}>
                Back to Home
            </Button>
            
			{/* <p className="ml-2 text-neutral-700 dark:text-neutral-300 text-sm">Login with Google</p> */}
		</div>
	);
};

export default NotFoundButton;
