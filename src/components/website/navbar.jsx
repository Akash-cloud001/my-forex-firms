import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {Button} from '../ui/button'
import { Menu } from 'lucide-react'
const Navbar = () => {
  return (
    <nav className='max-w-7xl mx-auto w-full flex items-center justify-between font-geist-sans pt-8 '>
        <Link href={'/'} className='flex items-center justify-center '>
            <figure>
                <Image src={'/logo.svg'} alt='my forex firms logo' width={44} height={44} />
            </figure>
            <h1 className='text-primary font-semibold text-2xl tracking-tight'>
                My Forex Firms
            </h1>
        </Link>

        <div className='text-xl flex items-center gap-4'>
            <Button variant='ghost' className='text-white cursor-pointer'>
                Log in
            </Button>
            <Button className='btn-grad cursor-pointer'>
                Sign Up
            </Button>
            <Button variant='ghost' size='icon-lg' className='cursor-pointer'>
                <Menu className='text-white'/>
            </Button>
        </div>
    </nav>
  )
}

export default Navbar