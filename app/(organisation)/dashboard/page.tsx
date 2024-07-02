import React from 'react'
import { redirect } from "next/navigation";
import Dashboard from '@/components/Dashboard';
// import { fetchOrganisationById } from '@/app/api/organisation/getOrganisationById/route';
// import { fetchCurrentUser } from "@/app/api/user/getCurrentUser/route";
import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";
import { getOrganisationById } from '@/actions/organisation';


type Props = {}

const dashboard = async (props: Props) => {
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


	

  let organisationInformation = await getOrganisationById(currentUser?.organisations[0])

  
  return (
    <div>
      
      <Dashboard organisationInformation={organisationInformation}/>
    </div>
  )
}

export default dashboard