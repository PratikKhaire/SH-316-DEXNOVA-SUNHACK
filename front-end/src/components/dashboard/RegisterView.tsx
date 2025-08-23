"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sparkles, Loader2 } from 'lucide-react';
import type { SuggestLocationInput, SuggestLocationOutput } from '@/ai/flows/suggest-location';

const formSchema = z.object({
  location: z.string().min(1, 'Location is required.'),
  ownerName: z.string().min(1, 'Owner name is required.'),
  documentHash: z.string().min(1, 'Document hash is required.'),
});

interface RegisterViewProps {
  onRegister: (data: z.infer<typeof formSchema>) => Promise<void>;
  suggestLocationFn: (input: SuggestLocationInput) => Promise<SuggestLocationOutput>;
}

export function RegisterView({ onRegister, suggestLocationFn }: RegisterViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      ownerName: '',
      documentHash: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await onRegister(values);
    setIsSubmitting(false);
    form.reset();
  }

  async function handleSuggestLocation() {
    const locationDescription = form.getValues("location");
    if (!locationDescription) {
        form.setError("location", { type: "manual", message: "Please enter a description first." });
        return;
    }
    setIsSuggesting(true);
    try {
        const result = await suggestLocationFn({ locationDescription });
        if (result.gpsCoordinates) {
            form.setValue("location", result.gpsCoordinates);
            form.clearErrors("location");
        }
    } catch (error) {
        console.error("AI suggestion failed:", error);
        form.setError("location", { type: "manual", message: "AI suggestion failed." });
    } finally {
        setIsSuggesting(false);
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Register New Land</CardTitle>
        <CardDescription>Fill in the details to register a new land asset on the blockchain.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Description or GPS</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 'near downtown' or '34.0522,-118.2437'" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={handleSuggestLocation} disabled={isSuggesting}>
                        {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        <span className="ml-2 hidden sm:inline">Suggest</span>
                    </Button>
                  </div>
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
            <FormField
              control={form.control}
              name="documentHash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Hash (IPFS)</FormLabel>
                  <FormControl>
                    <Input placeholder="IPFS CID of the land deed" {...field} />
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
