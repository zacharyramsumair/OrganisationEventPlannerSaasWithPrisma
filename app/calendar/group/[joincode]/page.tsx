import React from 'react';
import SeeEvents from '@/components/SeeEvents';
import { getGroupByJoincode } from '@/actions/group';
import { redirect } from 'next/navigation';

const Page = async ({ params }: { params: { joincode: string } }) => {
  let { joincode } = params;

  if (!(joincode.startsWith('@') || joincode.startsWith('%40'))) {
    redirect(`/calendar/group/@${joincode}`);
  }

  joincode = joincode.replace('%40', '@');  
  joincode = joincode.substring(1);  

  let groupInfo: any;

  try {
    groupInfo = await getGroupByJoincode(joincode);
  } catch (error) {
    console.error('Error fetching group info:', error);
    groupInfo = null;
  }

  // Check if groupInfo is an object with a name property
  const hasGroupInfo = groupInfo && typeof groupInfo === 'object' && 'name' in groupInfo;

  return (
    <div className="min-h-screen">
      {hasGroupInfo ? (
        <>
          <h1 className="text-4xl font-bold text-center mt-4 mb-2">@{groupInfo.name}</h1>
          {/* <h2 className="text-2xl font-semibold text-center mb-4 text-gray-500">@{groupInfo.username}</h2> */}
          <SeeEvents groupJoincode={joincode} />
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
