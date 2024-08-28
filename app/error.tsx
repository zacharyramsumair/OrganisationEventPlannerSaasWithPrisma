"use client"

import NotFoundButton from "@/components/NotFoundButton";
import React from "react";

type Props = {};

const Error = async (props: Props) => {

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
			<div className="max-w-md w-full mx-auto mb-40 p-6 bg-white  rounded-lg dark:bg-gray-800">
				<h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
					An Error Occurred
				</h1>
				<p>Please logout and  try again.</p>
				<p>
					If the problem persists, clear your cookies for this site and try
					again.
				</p>
			</div>
		</div>
	);
};

export default Error;
