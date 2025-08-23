import React, { useState, useEffect } from 'react'
import Logo from '@/assets/logosaas.png'
import Image from 'next/image'
import MenuIcon from '@/assets/menu.svg'
import CloseIcon from '@/assets/check.svg'
import { ConnectWallet } from './ConnectWallet'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  function handleConnect(account: string | null): void {
    console.log('Connected account:', account)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])
  
  return (
    <header className={`sticky z-50 top-0 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <Image 
              src={Logo} 
              alt="DeXnova Logo" 
              height={40} 
              width={40} 
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className='font-bold text-xl sm:text-2xl text-gray-900'>DeXnova</span>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8 text-gray-600" aria-label="Main navigation">
            <a 
              href="#about" 
              className="hover:text-gray-900 transition-colors font-medium"
              aria-label="Learn about our platform"
            >
              About
            </a>
            <a 
              href="#help" 
              className="hover:text-gray-900 transition-colors font-medium"
              aria-label="Get help and support"
            >
              Help
            </a>
            <div className="ml-4">
              <ConnectWallet onConnect={handleConnect} />
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <Image src={CloseIcon} alt="Close menu" width={20} height={20} />
            ) : (
              <Image src={MenuIcon} alt="Open menu" width={20} height={20} />
            )}
          </button>
        </div>
        
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            
            {/* Menu panel */}
            <div 
              className="fixed top-16 right-0 w-80 max-w-full h-[calc(100vh-4rem)] bg-white border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <nav className="flex flex-col p-6 gap-6 h-full">
                <a 
                  href="#about" 
                  className="py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors font-medium text-gray-900"
                  onClick={closeMobileMenu}
                  aria-label="Learn about our platform"
                >
                  About
                </a>
                <a 
                  href="#help" 
                  className="py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors font-medium text-gray-900"
                  onClick={closeMobileMenu}
                  aria-label="Get help and support"
                >
                  Help
                </a>
                <div className="mt-auto pt-6 border-t border-gray-200">
                  <ConnectWallet onConnect={handleConnect} />
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
