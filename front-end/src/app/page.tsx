'use client'

import { useState, useMemo } from 'react'
import type { Land } from '@/lib/types'
import { suggestLocation } from '@/ai/flows/suggest-location'

import Header from '@/components/Header'
import { Hero } from '@/components/Hero'
import { ProductShowcase } from '@/components/ProductShowcase'
import { ConnectWallet } from '@/components/ConnectWallet'
import { DashboardView } from '@/components/dashboard/DashboardView'
import { RegisterView } from '@/components/dashboard/RegisterView'
import { TransferView } from '@/components/dashboard/TransferView'
import { MapView } from '@/components/dashboard/MapView'
import { useLandLedger } from '@/hooks/useLandLedger'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Landmark } from 'lucide-react'

export default function Page() {
  const [account, setAccount] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const { lands, loading, registerLand, transferLand, fetchLands } =
    useLandLedger(account)

  const landsWithCoords = useMemo(
    () =>
      lands.filter((land) => {
        try {
          const coords = JSON.parse(land.location)
          return (
            Array.isArray(coords) &&
            coords.length > 0 &&
            coords[0].lat &&
            coords[0].lng
          )
        } catch (e) {
          return land.location.includes(',')
        }
      }),
    [lands]
  )

  const handleConnect = (acc: string | null) => {
    setAccount(acc)
  }

  const handleRegistration = async (data: {
    location: string
    ownerName: string
    documentHash: string
    area: string
  }) => {
    await registerLand(data)
    fetchLands()
  }

  const handleTransfer = async (data: {
    landId: string
    newOwnerAddress: string
    newOwnerName: string
  }) => {
    await transferLand(data)
    fetchLands()
  }

  return (
    <div className="font-sora">
      <Header>
        <ConnectWallet onConnect={handleConnect} />
      </Header>
      <Hero />
      <ProductShowcase />
      <main className="flex-grow container mx-auto px-4 py-8">
        {!account ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Card className="w-full max-w-md text-center shadow-lg">
              <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
                  <Landmark className="w-10 h-10" />
                </div>
                <CardTitle>Welcome to LandView</CardTitle>
                <CardDescription>
                  Please connect your wallet to manage your land assets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConnectWallet onConnect={handleConnect} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <nav className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger
                  value="dashboard"
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  onClick={() => setActiveTab('register')}
                >
                  Register Land
                </TabsTrigger>
                <TabsTrigger
                  value="transfer"
                  onClick={() => setActiveTab('transfer')}
                >
                  Transfer Land
                </TabsTrigger>
                <TabsTrigger value="map" onClick={() => setActiveTab('map')}>
                  Map View
                </TabsTrigger>
              </TabsList>
            </nav>
            <div>
              {activeTab === 'dashboard' && (
                <DashboardView lands={lands} loading={loading} />
              )}
              {activeTab === 'register' && (
                <RegisterView
                  onRegister={handleRegistration}
                  suggestLocationFn={suggestLocation}
                />
              )}
              {activeTab === 'transfer' && (
                <TransferView lands={lands} onTransfer={handleTransfer} />
              )}
              {activeTab === 'map' && <MapView lands={landsWithCoords} />}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
