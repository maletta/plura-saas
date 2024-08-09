import React, { type PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return <div className="h-full flex items-center justify-center">
    {children}
    <p>layout agency</p>
  </div>
}

export default AuthLayout;