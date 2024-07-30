import GroupForm from '@/components/GroupForm'
import React from 'react'
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";



type Props = {}

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
  return (
    <div>
      <GroupForm currentUser={currentUser}/>
    </div>
  )
}

export default page