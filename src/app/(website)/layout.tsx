import React from 'react'
import Navbar from '@/components/website/navbar'
import BottomBar from '@/components/website/bottombar'
const WebsiteLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className='bg-background min-h-screen w-full pt-12'>
        <Navbar />
        {children}
        <BottomBar />
    </section>
  )
}

export default WebsiteLayout;