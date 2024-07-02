import OrganisationForm from "@/components/OrganisationForm";
import { redirect } from "next/navigation";
import React from "react";
import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";

type Props = {};

const CreateOrganisation = async (props: Props) => {
	const session = await auth();

	let currentUser: any = false;
	if (session?.user?.email) {
		currentUser = await getUserByEmail(session?.user?.email);
	}

    console.log("currentUser", currentUser);

	if (!currentUser) {
		redirect("/");
	}

    if (currentUser?.organisations?.length > 0) {
		redirect("/dashboard");
	}
	return (
		<div>
			<OrganisationForm currentUser={currentUser} />
		</div>
	);
};

export default CreateOrganisation;