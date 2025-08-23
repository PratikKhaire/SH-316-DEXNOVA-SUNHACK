'use client'

import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tabs } from '@radix-ui/react-tabs' // Assuming you're using Radix UI for Tabs
import { LayoutDashboard, FilePlus, ArrowRightLeft, MapPin } from 'lucide-react'

interface TabbedInterfaceProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  children: React.ReactNode
}

export function TabbedInterface({ activeTab, setActiveTab, children }: TabbedInterfaceProps) {
  return (
    <>
      <nav className="mb-8">
        <Tabs value={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-amber-50 via-blue-50 to-indigo-100 p-1 rounded-xl shadow-lg border border-gray-200/50">
            <TabsTrigger
              value="dashboard"
              onClick={() => setActiveTab('dashboard')}
              className="relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-amber-600 hover:bg-white/50 hover:text-amber-500 group"
            >
              <LayoutDashboard className="w-4 h-4 transition-transform group-hover:scale-110" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="register"
              onClick={() => setActiveTab('register')}
              className="relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 hover:bg-white/50 hover:text-blue-500 group"
            >
              <FilePlus className="w-4 h-4 transition-transform group-hover:scale-110" />
              Register
            </TabsTrigger>
            <TabsTrigger
              value="transfer"
              onClick={() => setActiveTab('transfer')}
              className="relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 hover:bg-white/50 hover:text-green-500 group"
            >
              <ArrowRightLeft className="w-4 h-4 transition-transform group-hover:scale-110" />
              Transfer
            </TabsTrigger>
            <TabsTrigger
              value="map"
              onClick={() => setActiveTab('map')}
              className="relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 hover:bg-white/50 hover:text-indigo-500 group"
            >
              <MapPin className="w-4 h-4 transition-transform group-hover:scale-110" />
              Map View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </nav>
      <div className="relative">
        {/* Decorative background element */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-blue-50/20 to-indigo-100/20 rounded-2xl -z-10" />

        {/* Animated content container */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/30 transition-all duration-300 hover:shadow-xl">
          {children}
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-amber-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-blue-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
    </>
  )
}
