//rafce
import React, { PropsWithChildren } from 'react'

interface IBlurPageProps extends PropsWithChildren { }

const BlurPage: React.FC<IBlurPageProps> = ({ children }) => {
  return (
    <div
      className='h-screen overflow-scroll backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black mx-auto p-4 pt-24 absolute top-0 right-0 left-0 bottom-0 z-[11]'
      id="blur-page"
    >
      {children}
    </div>
  )
}

export default BlurPage;

