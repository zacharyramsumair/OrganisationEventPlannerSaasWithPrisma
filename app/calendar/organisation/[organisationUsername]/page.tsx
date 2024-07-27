import React from 'react';
import SeeEvents from '@/components/SeeEvents';
import { getOrganisationByUsername } from '@/actions/event';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { organisationUsername: string } }) => {
  let { organisationUsername } = params;

  if (!(organisationUsername.startsWith('@') || organisationUsername.startsWith('%40'))) {
    redirect(`/calendar/organisation/@${organisationUsername}`);
  }



  let organisationInfo;

  organisationUsername = organisationUsername.replace('%40', '@');  
  organisationUsername = organisationUsername.substring(1);  

  try {
    organisationInfo = await getOrganisationByUsername(organisationUsername);
  } catch (error) {
    console.error('Error fetching organisation info:', error);
    organisationInfo = null;
  }

  return (
    <div className="min-h-screen">
      {organisationInfo ? (
        <>
          <h1 className="text-4xl font-bold text-center mt-4 mb-2">{organisationInfo.name}</h1>
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-500">@{organisationInfo.username}</h2>
          <SeeEvents organisationUsername={organisationUsername} />
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-center mt-4 mb-2">Organisation not found</h1>
          <SeeEvents />
        </>
      )}
    </div>
  );
};

export default Page;