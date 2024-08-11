import EventForm from "@/components/EventForm";
import React from "react";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";
import { getAllGroupsForOrganisation } from "@/actions/group";

type Props = {};

const page = async (props: Props) => {
	const session = await auth();

	let currentUser: any = false;
	if (session?.user?.email) {
		currentUser = await getUserByEmail(session?.user?.email);
	}

	if (!currentUser) {
		redirect("/login");
	}

	if (!(currentUser?.organisations?.length > 0)) {
		redirect("/createOrganisation");
	}

	let groups = await getAllGroupsForOrganisation(currentUser);

	const transformedArray = groups.map((item: any) => ({
		value: item.joincode,
		label: item.name,
	}));


	let groupsForCombobox = [
		{
			value: "#$%none",
			label: "Your Organisation Only",
		},
		{
			value: "#$%allGroups",
			label: "All My Groups",
		},
		{
			value: "#$%everyone",
			label: "Everyone",
		},
		...transformedArray,
	];

	// console.log("groups", groupsForCombobox);


	return (
		<div>
			<EventForm currentUser={currentUser} groupsForCombobox={groupsForCombobox} />
		</div>
	);
};

export default page;
