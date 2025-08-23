'use client'
import cogImage from '@/assets/cog.png'
import cylinderImage from '@/assets/cylinder.png'
import noodleImage from '@/assets/noodle.png'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ConnectWallet } from './ConnectWallet'
import { Button } from './ui/button'
import { ArrowRight, Shield, Map, FileText } from 'lucide-react'

export const Hero = () => {
  const heroRef = useRef(null)
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start'],
  })

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150])

  function handleConnect(account: string | null): void {
    setConnectedAccount(account)
    console.log('Connected account:', account)
  }

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure Ownership",
      description: "Blockchain-powered land registry system"
    },
    {
      icon: <Map className="h-5 w-5" />,
      title: "Visual Mapping",
      description: "Interactive property visualization"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Digital Records",
      description: "Immutable land ownership history"
    }
  ]

  return (
    <section
      ref={heroRef}
      className="relative max-w-full px-6 py-16 md:py-24 lg:py-32 bg-gradient-to-br from-amber-50 via-blue-50 to-indigo-100 overflow-x-clip"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-blue-200/20" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium"
              >
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
                Version 2.0 is here
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Welcome to{' '}
                <span className="bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-transparent">
                  LandLedger
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
              >
                The simple, modern, and secure way to manage and verify land
                ownership online. Visualize properties on interactive maps and
                track complete ownership history on the blockchain.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid gap-4"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm border flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <ConnectWallet onConnect={handleConnect} />
              <Button variant="outline" className="gap-2">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Visual Elements */}
          <div className="relative lg:h-[600px]">
            <motion.div
              className="relative w-full h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.img
                src={cogImage.src}
                alt="Blockchain technology visualization"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 lg:w-96 lg:h-96"
                animate={{ 
                  rotate: 360,
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              />
              
              <motion.img
                src={cylinderImage.src}
                alt="Data storage visualization"
                width={160}
                height={160}
                className="absolute top-20 right-8 hidden lg:block"
                style={{ translateY: translateY }}
              />
              
              <motion.img
                src={noodleImage.src}
                alt="Network connection visualization"
                width={140}
                height={140}
                className="absolute bottom-20 left-8 hidden lg:block rotate-45"
                style={{ translateY: translateY }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

