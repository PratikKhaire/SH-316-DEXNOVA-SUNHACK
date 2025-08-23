
"use client";

import { useEffect, useRef } from 'react';
import L, { LatLngExpression } from 'leaflet';
import type { Land } from '@/lib/types';

type Coordinate = { lat: number; lng: number };

interface MapComponentProps {
    landMarkers: (Land & {
        coordinates: Coordinate[];
        center: Coordinate;
    })[];
    defaultCenter: LatLngExpression;
}

export default function MapComponent({ landMarkers, defaultCenter }: MapComponentProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        // Fix for default icon issue with Leaflet and Webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView(defaultCenter, 8);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        }

        // Cleanup function to destroy the map instance
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [defaultCenter]);

    useEffect(() => {
        if (mapRef.current) {
            // Clear existing layers
            mapRef.current.eachLayer((layer) => {
                if (layer instanceof L.Polygon || layer instanceof L.Marker) {
                    mapRef.current?.removeLayer(layer);
                }
            });

            landMarkers.forEach((land) => {
                if (!mapRef.current) return;

                const popupContent = `
                    <div class="p-2">
                        <h3 class="font-bold text-base">Land #${land.id.toString()}</h3>
                        <p class="text-sm mt-1">Owner: ${land.ownerName}</p>
                        <p class="text-sm mt-1">Area: ${parseFloat(land.area).toFixed(2)} m²</p>
                    </div>
                `;

                if (land.coordinates.length > 1) {
                    const leafletCoords: LatLngExpression[] = land.coordinates.map(c => [c.lat, c.lng]);
                    L.polygon(leafletCoords).addTo(mapRef.current).bindPopup(popupContent);
                } else if (land.coordinates.length === 1) {
                    const center: LatLngExpression = [land.center.lat, land.center.lng];
                    L.marker(center).addTo(mapRef.current).bindPopup(popupContent);
                }
            });
        }
    }, [landMarkers]);


    return (
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}></div>
    );
}
