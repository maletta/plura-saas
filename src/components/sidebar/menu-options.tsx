"user client";
import { IGetAuthUserDetails } from "@/lib/queries";
import { Agency, AgencySidebarOption, SubAccount, SubAccountSidebarOption } from "@prisma/client";
import React from "react";

interface IMenuOptionsProps {
  defaultOpen?: boolean;
  subAccount: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: Agency | SubAccount;
  user: IGetAuthUserDetails;
  id: string;
}

const MenuOptions = ({ details, id, sidebarLogo, sidebarOpt, subAccount, user }: IMenuOptionsProps) => {
  return <div></div>
}

export default MenuOptions;