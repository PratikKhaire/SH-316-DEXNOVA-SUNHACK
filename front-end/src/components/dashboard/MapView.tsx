"use client";

import { useState } from 'react';
import type { Land } from '@/lib/types';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { MapIcon } from 'lucide-react';

interface MapViewProps {
  lands: Land[];
}

// It is recommended to move the API key to environment variables
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const getCoordinates = (location: string): { lat: number, lng: number } | null => {
    const parts = location.split(',').map(s => s.trim());
    if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
        }
    }
    return null;
}

export function MapView({ lands }: MapViewProps) {
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);

  const landMarkers = lands.map(land => ({
    ...land,
    coordinates: getCoordinates(land.location)
  })).filter(land => land.coordinates !== null);
  
  const defaultCenter = landMarkers.length > 0 && landMarkers[0].coordinates ? landMarkers[0].coordinates : { lat: 34.0522, lng: -118.2437 };

  if (!API_KEY) {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><MapIcon />Map Unavailable</CardTitle>
            <CardDescription>The Google Maps API key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables to enable map functionality.</CardDescription>
          </CardHeader>
        </Card>
      );
  }

  return (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle>Land Asset Map</CardTitle>
            <CardDescription>Visual representation of your land assets with GPS coordinates. Click a marker for details.</CardDescription>
        </CardHeader>
        <CardContent>
            <div style={{ height: '60vh', width: '100%' }} className='rounded-lg overflow-hidden'>
                <APIProvider apiKey={API_KEY}>
                    <Map
                        defaultCenter={defaultCenter}
                        defaultZoom={landMarkers.length > 1 ? 8 : 12}
                        mapId="landview-map"
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                    >
                        {landMarkers.map((land, index) => (
                            land.coordinates &&
                            <AdvancedMarker
                                key={index}
                                position={land.coordinates}
                                onClick={() => setSelectedLand(land)}
                            />
                        ))}

                        {selectedLand && selectedLand.coordinates && (
                            <InfoWindow
                                position={selectedLand.coordinates}
                                onCloseClick={() => setSelectedLand(null)}
                            >
                                <div className="p-2">
                                    <h3 className="font-bold text-base">Land #{selectedLand.id.toString()}</h3>
                                    <p className="text-sm mt-1">Owner: {selectedLand.ownerName}</p>
                                    <p className="text-xs text-muted-foreground mt-1 font-mono">{selectedLand.location}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </Map>
                </APIProvider>
            </div>
            {landMarkers.length < lands.length && (
                <p className="text-sm text-muted-foreground mt-4">
                    Note: {lands.length - landMarkers.length} land(s) could not be displayed on the map due to missing or invalid GPS coordinates in their location field.
                </p>
            )}
        </CardContent>
    </Card>
  );
}
