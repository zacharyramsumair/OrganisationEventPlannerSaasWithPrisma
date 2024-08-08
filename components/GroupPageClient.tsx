"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Copy, Plus, DoorOpen, CircleX } from "lucide-react";
import { motion } from "framer-motion";
import { joinGroup, leaveGroup,removeOrganisationFromGroup } from "@/actions/group";
import { useRouter } from "next/navigation";

const GroupPageClient = ({ groupInfo, currentUser }: any) => {
	const searchParams = useSearchParams();
	const secret = searchParams.get("secret");
	const router = useRouter();

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(
			() => {
				toast({
					title: "Invite URL copied to clipboard",
					description: "Share this with others to invite them to your group",
				});
			},
			(err) => {
				console.error("Could not copy text: ", err);
			}
		);
	};

	const joinGroupButtonClick = async () => {
		const group = await joinGroup(groupInfo.id, currentUser?.organisations[0].id);
		// window.location.reload();
	};

	const removeOrganisationButtonClick = async (organisationId:string) => {
		const group = await removeOrganisationFromGroup(currentUser, groupInfo.id, organisationId);
		toast({
			title: "Organisation removed from group",
			// description: "Share this with others to invite them to your group",
		});
		// window.location.reload();
	};

	const leaveGroupButtonClick = async () => {
		const group = await leaveGroup(groupInfo.id, currentUser?.organisations[0].id);
		router.push("/dashboard");
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="p-6 shadow-lg rounded-lg max-w-3xl mx-auto"
		>
			<motion.h1
				className="text-2xl font-bold"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				Group Details
			</motion.h1>
			<motion.div
				className="mt-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<p className="text-lg font-semibold mt-2">Group name: {groupInfo.name}</p>

				{groupInfo.description.length > 0 && (
					<>
						<p className="text-lg font-semibold mt-2">Group description:</p>
						<p>{groupInfo.description}</p>
					</>
				)}

				<p className="text-lg font-semibold mt-2">Organisations:</p>
				<ul className="list-disc list-inside">
					{groupInfo.groupOrganisations.map((organisation: any) => (
						<li key={organisation.id} className="flex items-center">
							{groupInfo.adminOrganisationIds.includes(currentUser?.organisations[0].id) &&
								organisation.id !== currentUser?.organisations[0].id && (
									<CircleX onClick={()=>{removeOrganisationButtonClick(organisation.id)}} className="mr-2 text-red-500 cursor-pointer" />
								)}
							@{organisation.username}
						</li>
					))}
				</ul>

				{groupInfo.organisations.includes(currentUser?.organisations[0].id) &&
					!groupInfo.adminOrganisationIds.includes(currentUser?.organisations[0].id) && (
						<div className="my-6">
							<Button onClick={leaveGroupButtonClick} variant={"destructive"}>
								<DoorOpen className="mr-2" /> Leave Group
							</Button>
						</div>
					)}

				{secret === groupInfo.secret &&
					!groupInfo.organisations.includes(currentUser?.organisations[0].id) && (
						<div className="my-6">
							<Button className="bg-green-500 hover:bg-green-600" onClick={joinGroupButtonClick}>
								<Plus className="mr-2" /> Join Group
							</Button>
						</div>
					)}

				{/* Uncomment if needed */}
				{/* <div className="flex items-center mt-4">
					<Button
						className="ml-4"
						onClick={(e) => {
							e.preventDefault();
							copyToClipboard(`${window.location.origin}/group/${groupInfo.id}?secret=message`);
						}}
					>
						<Copy className="mr-2" /> Copy URL
					</Button>
				</div> */}
			</motion.div>
		</motion.div>
	);
};

export default GroupPageClient;
