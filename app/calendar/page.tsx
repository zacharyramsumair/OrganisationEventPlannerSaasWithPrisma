import React from "react";
import SeeEvents from "@/components/SeeEvents";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";
import { getAllGroupsForOrganisation } from "@/actions/group";

const Page = async () => {
	const session = await auth();

	let currentUser: any = false;
	if (session?.user?.email) {
		currentUser = await getUserByEmail(session?.user?.email);
	}

	let groups: any = [];

	if (currentUser) {
		groups = await getAllGroupsForOrganisation(currentUser);
	}

	const transformedArray = groups.map((item: any) => ({
		value: item.joincode,
		label: item.name,
	}));

	let groupsForCombobox = [
    {
      value: "#$%everyone",
      label: "Everyone",
    },
		{
			value: "#$%none",
			label: "Your Organisation Only",
		},
		{
			value: "#$%allGroups",
			label: "All My Groups",
		},
		...transformedArray,
	];

	return (
		<div className="min-h-screen">
			<SeeEvents groupsForCombobox={groupsForCombobox} currentUser={currentUser} />
		</div>
	);
};

export default Page;
