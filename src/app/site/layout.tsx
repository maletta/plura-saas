import Navigation from "@/components/site/Navigation";
import React, { type PropsWithChildren } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import {
  dark
} from "@clerk/themes";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme
          : dark
      }}>
      <main className="h-full">
        <Navigation />
        {children}
      </main>
    </ClerkProvider>

  )
}

export default Layout;