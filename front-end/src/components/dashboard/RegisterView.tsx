
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, MapPinned } from 'lucide-react';
import type { SuggestLocationInput, SuggestLocationOutput } from '@/ai/flows/suggest-location';
import dynamic from 'next/dynamic';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Skeleton } from '../ui/skeleton';

const formSchema = z.object({
  location: z.string().min(1, 'Location is required. Please draw on the map or enter coordinates.'),
  ownerName: z.string().min(1, 'Owner name is required.'),
  documentHash: z.string().min(1, 'Area is required and calculated from the map.'),
});

interface RegisterViewProps {
  onRegister: (data: z.infer<typeof formSchema>) => Promise<void>;
  suggestLocationFn: (input: SuggestLocationInput) => Promise<SuggestLocationOutput>;
}

const MapWithDrawingWithNoSSR = dynamic(() => import('@/components/dashboard/MapWithDrawing'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />
});

export function RegisterView({ onRegister, suggestLocationFn }: RegisterViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      ownerName: '',
      documentHash: '',
    },
  });

  const setPolygonPath = (path: string) => {
    form.setValue('location', path, { shouldValidate: true });
  }

  const setArea = (area: number) => {
    form.setValue('documentHash', `${area.toFixed(2)}`, { shouldValidate: true });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await onRegister(values);
    setIsSubmitting(false);
    form.reset();
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Register New Land</CardTitle>
        <CardDescription>Draw the boundaries of your land on the map or manually enter the coordinates. Then, fill in the details to register the asset.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <MapPinned className="w-5 h-5" />
            Land Boundaries
          </h3>
          <div style={{ height: '40vh', width: '100%' }} className='rounded-lg overflow-hidden border'>
            {isClient ? <MapWithDrawingWithNoSSR setPolygonPath={setPolygonPath} setArea={setArea} /> : <Skeleton className="h-full w-full" />}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Coordinates (JSON)</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g., [{"lat":34.05,"lng":-118.24},...]' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentHash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area (Square Meters)</FormLabel>
                  <FormControl>
                    <Input placeholder="Calculated from map drawing" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Land
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
