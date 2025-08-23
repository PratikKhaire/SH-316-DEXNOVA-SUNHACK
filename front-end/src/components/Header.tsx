import React from 'react'
import Logo from '@/assets/logosaas.png'
import Image from 'next/image'
import MenuIcon from '@/assets/menu.svg'
import { ConnectWallet } from './ConnectWallet'
import { CardContent } from './ui/card'
const Header = () => {
  function handleConnect(account: string | null): void {
    throw new Error('Function not implemented.')
  }

  return (
    <header className="sticky z-20 top-0 backdrop-blur-sm pl-20 pr-10">
      <div className="py-5">
        <div className="container lg:px-0">
          <div className="flex items-center justify-between">
            <Image src={Logo} alt="Saas Logo" height={40} width={40} />
            <span className=" flex flex-1 pl-4 font-bold text-4xl">
              DeXnova
            </span>
            {/* <MenuIcon className="h-5 w-5 md:hidden" /> */}
            <nav className="hidden md:flex text-black/60 gap-6 items-center">
              <a href="#">About</a>
              <a href="#">Help</a>
              <CardContent>
                <ConnectWallet onConnect={handleConnect} />
              </CardContent>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
