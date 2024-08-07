import React from "react";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";
import GroupPageClient from "@/components/GroupPageClient";
import { getGroupByJoincode } from "@/actions/group";

const Page = async ({ params }: { params: { joincode: string } }) => {
	const { joincode } = params;

	const session = await auth();

	let currentUser: any = false;
	if (session?.user?.email) {
		currentUser = await getUserByEmail(session?.user?.email);
	}

	if (!currentUser) {
		redirect("/");
	}

	if (!(currentUser?.organisations?.length > 0)) {
		redirect("/createOrganisation");
	}

	let groupInfo = await getGroupByJoincode(joincode);

// console.log(groupInfo)

	if (!groupInfo) {
		return (
			<div>
				<h1>Group Not found</h1>
			</div>
		);
	}

	return (
		<div>
			<GroupPageClient groupInfo={groupInfo} currentUser={currentUser} />
		</div>
	);
};

export default Page;
