import { redirect } from "next/navigation";
import React from "react";
import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";
import { getOrganisationByIdWithoutPopulatedEvents } from "@/actions/organisation";
import EditOrganisationForm from "@/components/EditOrganisationForm";

type Props = {};

const EditOrganisation = async (props: Props) => {
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

	let organisationInformation = await getOrganisationByIdWithoutPopulatedEvents(
		currentUser.organisations[0].id
	);
    

	return (
		<div>
			
			<EditOrganisationForm  currentUser={currentUser} organisationInformation={organisationInformation}/>
		</div>
	);
};

export default EditOrganisation;
