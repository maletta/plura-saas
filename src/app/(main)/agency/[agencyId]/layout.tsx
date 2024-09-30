import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import { getNotificationAndUser, IGetNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { PropsWithChildren } from "react";

interface ILayoutProps extends PropsWithChildren {
  params: {
    agencyId: string;
  }
}

const Layout = async ({ children, params }: ILayoutProps) => {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();

  if (!user) return redirect('/');

  if (!agencyId) return redirect('/agency');

  if (user.privateMetadata.role !== "AGENCY_OWNER"
    && user.privateMetadata.role !== "AGENCY_ADMIN"
  ) {
    return <Unauthorized />
  }

  let allNoti: IGetNotificationAndUser[] = []
  const notifications = await getNotificationAndUser(agencyId);

  if (notifications) {
    allNoti = notifications;
  }


  return <div className="h-screen overflow-hidden">
    <Sidebar
      id={params.agencyId}
      type="agency"
    />
    <div className="md:pl-[300px]">{children}</div>
  </div>
}

export default Layout;