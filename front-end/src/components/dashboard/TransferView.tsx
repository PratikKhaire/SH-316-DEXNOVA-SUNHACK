"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Land } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  landId: z.string().min(1, 'Please select a land to transfer.'),
  newOwnerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address.'),
  newOwnerName: z.string().min(1, 'New owner name is required.'),
});

interface TransferViewProps {
  lands: Land[];
  onTransfer: (data: z.infer<typeof formSchema>) => Promise<void>;
}

export function TransferView({ lands, onTransfer }: TransferViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      landId: '',
      newOwnerAddress: '',
      newOwnerName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await onTransfer(values);
    setIsSubmitting(false);
    form.reset();
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Transfer Land Ownership</CardTitle>
        <CardDescription>Select a land asset and specify the new owner's details to initiate a transfer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="landId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Land to Transfer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={lands.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a land asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lands.length > 0 ? lands.map((land) => (
                        <SelectItem key={land.id.toString()} value={land.id.toString()}>
                          Land #{land.id.toString()} - {land.location}
                        </SelectItem>
                      )) : <SelectItem value="-" disabled>No lands available</SelectItem>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newOwnerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Owner's Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newOwnerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Owner's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || lands.length === 0} className="w-full sm:w-auto">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Transfer Ownership
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
