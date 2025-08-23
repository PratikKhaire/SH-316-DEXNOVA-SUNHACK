
"use client";

import { useMemo, useState, useEffect } from 'react';
import type { Land } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import dynamic from 'next/dynamic';
import type { LatLngExpression } from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Skeleton } from '../ui/skeleton';

interface MapViewProps {
    lands: Land[];
}

const MapComponentWithNoSSR = dynamic(() => import('@/components/dashboard/MapComponent'), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />
});

type Coordinate = { lat: number; lng: number };

const getCoordinates = (location: string): Coordinate[] | null => {
    try {
        const coords = JSON.parse(location);
        if (Array.isArray(coords) && coords.length > 0 && 'lat' in coords[0] && 'lng' in coords[0]) {
            return coords;
        }
    } catch (e) {
        const parts = location.split(',').map(s => s.trim());
        if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
                return [{ lat, lng }];
            }
        }
    }
    return null;
}

const getCenter = (coords: Coordinate[]): Coordinate => {
    if (coords.length === 0) return { lat: 0, lng: 0 };
    if (coords.length === 1) return coords[0];

    let lat = 0, lng = 0;
    coords.forEach(coord => {
        lat += coord.lat;
        lng += coord.lng;
    });
    return { lat: lat / coords.length, lng: lng / coords.length };
};

export function MapView({ lands }: MapViewProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const landMarkers = useMemo(() => {
        return lands.map(land => {
            const coordinates = getCoordinates(land.location);
            if (!coordinates) return null;

            const center = getCenter(coordinates);
            return {
                ...land,
                coordinates,
                center,
            };
        }).filter((land): land is NonNullable<typeof land> => land !== null);
    }, [lands]);

    const defaultCenter: LatLngExpression = landMarkers.length > 0 && landMarkers[0].center ? [landMarkers[0].center.lat, landMarkers[0].center.lng] : [34.0522, -118.2437];

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Land Asset Map</CardTitle>
                <CardDescription>Visual representation of your land assets. Click a marker or polygon for details.</CardDescription>
            </CardHeader>
            <CardContent>
                <div style={{ height: '60vh', width: '100%' }} className='rounded-lg overflow-hidden'>
                    {isClient ? <MapComponentWithNoSSR landMarkers={landMarkers} defaultCenter={defaultCenter} /> : <Skeleton className="h-full w-full" />}
                </div>
                {landMarkers.length < lands.length && (
                    <p className="text-sm text-muted-foreground mt-4">
                        Note: {lands.length - landMarkers.length} land(s) could not be displayed on the map due to missing or invalid coordinates.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
