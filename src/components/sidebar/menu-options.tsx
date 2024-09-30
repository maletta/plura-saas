"use client";
import { IGetAuthUserDetails } from "@/lib/queries";
import { Agency, AgencySidebarOption, SubAccount, SubAccountSidebarOption } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChevronsUpDown, Compass, Menu } from "lucide-react";
import clsx from "clsx";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import Link from "next/link";

interface IMenuOptionsProps {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: Agency | SubAccount;
  user: IGetAuthUserDetails;
  id: string;
}

const MenuOptions = ({ details, id, sidebarLogo, sidebarOpt, subAccounts, user, defaultOpen }: IMenuOptionsProps) => {
  const [isMounted, setIsMounted] = useState(false);

  console.log("default open ", defaultOpen)
  console.log("subaccouts", subAccounts)

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : { open: false }),
    [defaultOpen]
  );

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return;

  return <Sheet
    modal={false}
    open={true}
  >
    <SheetTrigger asChild className="absolute left-4 top-4 z-[100] md:!hidden flex">
      <Button variant={"outline"} size={"icon"}><Menu /></Button>
    </SheetTrigger>
    <SheetContent
      // showX={!defaultOpen}
      showX={true}
      side={"left"}
      className={clsx(
        "bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6", // ambos
        { 'hidden md:inline-block z-0 w-[300px]': defaultOpen }, // web
        { "inline-block md:hidden z-[100] w-full": !defaultOpen }  // mobile
      )}>
      <div>
        <AspectRatio ratio={16 / 5} >
          <Image src={sidebarLogo} alt="Sidebar Logo" fill className={"rounded-md object-contain"} />
        </AspectRatio>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full mr-4 flex items-center justify-between py-8" variant={"ghost"}>
              <div className="flex items-center text-left gap-2">
                <Compass />
                <div className="flex flex-col">
                  {details.name}
                  <span className="text-muted-foreground">
                    {details.address}
                  </span>
                </div>
              </div>
              <div>
                <ChevronsUpDown size={16} className="text-muted-foreground" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 h-80 mt-4 z-[200]">
            {
              <Command className="rounded-lg">
                <CommandInput placeholder="Search Accounts..." />
                <CommandList className="pb-16">
                  <CommandEmpty>No results found</CommandEmpty>
                  {(user?.role === "AGENCY_OWNER" ||
                    user.role === "AGENCY_ADMIN") &&
                    user.Agency && (
                      <CommandGroup heading="Agency"  >
                        <CommandItem className="!bg-transparent hover:!bg-muted  cursor-pointer">
                          {defaultOpen ? (
                            <Link
                              href={`/agency/${user?.Agency?.id}`}
                              className="flex gap-4 w-full h-full"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={user?.Agency.agencyLogo}
                                  alt="Agency Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {user?.Agency?.name}
                                <span className="text-muted-foreground">
                                  {user?.Agency?.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/agency/${user?.Agency?.id}`}
                                className="flex gap-4 w-full h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={user?.Agency.agencyLogo}
                                    alt="Agency Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {user?.Agency?.name}
                                  <span className="text-muted-foreground">
                                    {user?.Agency?.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}
                  <CommandGroup heading="Accounts">
                    {(!!subAccounts)
                      ? subAccounts.map((subaccount) => (
                        <CommandItem key={subaccount.id}>
                          {defaultOpen ? (
                            <Link
                              href={`/subaccounts/${subaccount.id}`}
                              className="flex gap-4 w-full h-full"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={subaccount.subAccountLogo || ""}
                                  alt="Agency Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {subaccount.name}
                                <span className="text-muted-foreground">
                                  {subaccount.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/subaccounts/${subaccount.id}`}
                                className="flex gap-4 w-full h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={subaccount.subAccountLogo || ""}
                                    alt="Agency Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {subaccount.name}
                                  <span className="text-muted-foreground">
                                    {subaccount.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      ))
                      : 'No Accounts'}
                  </CommandGroup>
                </CommandList>
              </Command>
            }
          </PopoverContent>
        </Popover>
      </div>
    </SheetContent>
  </Sheet >


}

export default MenuOptions;