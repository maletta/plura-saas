import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {
  // const authUser = await currentUser();
  // if (!authUser) return redirect("/sign-in")

  const agencyId = await verifyAndAcceptInvitation();
  console.log("Agency Id ", agencyId);

  // get users details
  const user = await getAuthUserDetails();
  return (
    <div>Agency Dashboard</div>
  )
}

export default Page