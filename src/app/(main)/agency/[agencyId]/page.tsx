import React, { PropsWithChildren } from 'react';

interface IPageProps extends PropsWithChildren {
  params: {
    agencyId: string
  }
}

const Page = ({ params }: IPageProps) => {
  return <div>{params.agencyId}</div>
}

export default Page;