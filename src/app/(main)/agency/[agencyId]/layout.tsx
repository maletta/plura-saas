import { verifyAndAcceptInvitation } from "@/lib/queries";
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

  if (user.privateMetadata.role !== "AGENCY_OWNER") {

  }


  return children
}

export default Layout;