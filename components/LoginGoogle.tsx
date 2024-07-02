"use client";
import { login } from "@/actions/auth";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";


const LoginGoogle = () => {
	return (
		<div
			onClick={() => login("google")}
			className=" hover:cursor-pointer relative group/btn flex space-x-4 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
		>
			{/* <FaGoogle  /> */}
            <Image
							src="/google-logo.png"
							width={20}
							height={20}
							alt="Google Logo"
						/>
			<p className="ml-2 text-neutral-700 dark:text-neutral-300 text-sm">Login with Google</p>
		</div>
	);
};

export default LoginGoogle;
