import { getAuthUserDetails } from "@/lib/queries";
import { Agency, SubAccount } from "@prisma/client";
import React from "react";
import MenuOptions from "./menu-options";

type ISidebarProps = {
  id: string;
  type: "agency" | "subaccount"
}

const Sidebar = async ({ id, type }: ISidebarProps) => {
  const user = await getAuthUserDetails();

  if (!user) return null

  if (!user.Agency) return;

  const details: Agency | SubAccount | undefined = type === "agency"
    ? user?.Agency
    : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id);

  const isWhiteLabeledAgency = user.Agency.whiteLabel;

  if (!details) return;

  let sideBarLogo = user.Agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabeledAgency) {
    if (type === "subaccount") {
      sideBarLogo = user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.subAccountLogo || user.Agency.agencyLogo;
    }
  }

  const sidebarOpt = type === "agency"
    ? user.Agency.SidebarOption || []
    : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.SidebarOption || [];

  const subaccounts = user.Agency.SubAccount.filter(subaccount => user.Permissions.find(permission => permission.subAccountId === subaccount.id && permission.access));


  return <>
    {/* versão web */}
    <MenuOptions
      defaultOpen={true}
      details={details}
      id={id}
      sidebarLogo={sideBarLogo}
      sidebarOpt={sidebarOpt}
      subAccounts={subaccounts}
      user={user}
    />
    {/* versão mobile */}
    <MenuOptions
      details={details}
      id={id}
      sidebarLogo={sideBarLogo}
      sidebarOpt={sidebarOpt}
      subAccounts={subaccounts}
      user={user}
    />
  </>
}

export default Sidebar;