import React, { PropsWithChildren } from "react";
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
      {children}
    </ClerkProvider>

  )
}

export default Layout;