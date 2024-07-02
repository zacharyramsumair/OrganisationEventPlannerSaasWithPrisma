import React from "react";
// import EditEventForm from "@/components/EditEventForm";
import { redirect } from "next/navigation";
import { getEventById } from "@/actions/event";
import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";
import EditEventForm from "@/components/EditEventForm";

const EditEventPage = async ({ params }: { params: { id: string } }) => {
	const { id } = params;

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

   

	const currentEvent = await getEventById(id);

	if (!currentEvent) {
		redirect("/dashboard");
	}

    if (currentUser?.organisations[0].id !== currentEvent.organisationId) {
		redirect("/dashboard");
	}


	//   const { currentUser, currentEvent } = data;

	return (
		<div>
			<EditEventForm currentEvent={currentEvent} currentUser={currentUser} />
		</div>
	);
};

export default EditEventPage;
