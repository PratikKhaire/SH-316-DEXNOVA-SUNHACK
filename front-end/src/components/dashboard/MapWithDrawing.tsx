
"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-draw';

// Extend Leaflet types to include Draw functionality
declare global {
  namespace L {
    namespace Control {
      interface DrawOptions {}
      class Draw extends Control {
        constructor(options?: DrawOptions);
      }
    }
    
    namespace Draw {
      interface Event {
        layer: L.Layer;
        layers?: L.LayerGroup;
      }
      
      const Event: {
        CREATED: string;
        EDITED: string;
        DELETED: string;
      };
    }
  }
}

interface MapWithDrawingProps {
    setPolygonPath: (path: string) => void;
    setArea: (area: number) => void;
}

// Function to calculate polygon area using the shoelace formula
function calculatePolygonArea(latLngs: L.LatLng[]): number {
  if (latLngs.length < 3) return 0;
  
  let area = 0;
  const n = latLngs.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += latLngs[i].lng * latLngs[j].lat;
    area -= latLngs[j].lng * latLngs[i].lat;
  }
  
  area = Math.abs(area) / 2;
  
  // Convert to square meters (approximate conversion for small areas)
  // This is a simplified conversion - for more accuracy, use a proper geodesic calculation
  return area * 10000 * 10000; // Rough approximation
}

export default function MapWithDrawing({ setPolygonPath, setArea }: MapWithDrawingProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

    useEffect(() => {
        // Fix for default icon issue with Leaflet and Webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current).setView([34.0522, -118.2437], 10);
            mapRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);
            drawnItemsRef.current = drawnItems;

            const drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: drawnItems
                },
                draw: {
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                    },
                    polyline: false,
                    rectangle: false,
                    circle: false,
                    marker: false,
                    circlemarker: false,
                }
            });
            map.addControl(drawControl);

            map.on(L.Draw.Event.CREATED, (e) => {
                const layer = e.layer;
                drawnItems.clearLayers();
                drawnItems.addLayer(layer);

                const latLngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
                const coords = latLngs.map(p => ({ lat: p.lat, lng: p.lng }));
                setPolygonPath(JSON.stringify(coords));

                const area = calculatePolygonArea(latLngs);
                setArea(area);
            });

            map.on(L.Draw.Event.EDITED, (e: any) => {
                if (e.layers) {
                    e.layers.eachLayer((layer: L.Layer) => {
                        const latLngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
                        const coords = latLngs.map(p => ({ lat: p.lat, lng: p.lng }));
                        setPolygonPath(JSON.stringify(coords));

                        const area = calculatePolygonArea(latLngs);
                        setArea(area);
                    });
                }
            });

            map.on(L.Draw.Event.DELETED, () => {
                setPolygonPath('');
                setArea(0);
            });
        }

        // Cleanup function to destroy the map instance
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [setArea, setPolygonPath]);

    return (
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}></div>
    );
}
