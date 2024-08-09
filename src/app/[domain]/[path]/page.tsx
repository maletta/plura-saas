"use client";
import React from "react";
import { useRouter } from 'next/navigation'

interface IDomainPageProps {
  domain: string
}
const Page = (props: IDomainPageProps) => {
  const r = useRouter();
  console.log(r);
  return (
    <div>
      page domain
    </div>
  )
}

export default Page;