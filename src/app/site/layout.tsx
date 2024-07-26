import Navigation from "@/components/site/Navigation";
import React, { type PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return <main className="h-full">
    <Navigation />
    {children}
  </main>
}

export default Layout;