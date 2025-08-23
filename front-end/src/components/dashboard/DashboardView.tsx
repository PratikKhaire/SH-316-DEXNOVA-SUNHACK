"use client";

import type { Land } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Hash, MapPin, User, FileText } from 'lucide-react';
import { Button } from '../ui/button';

interface DashboardViewProps {
  lands: Land[];
  loading: boolean;
}

const LandCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-8 w-24" />
        </CardFooter>
    </Card>
)

export function DashboardView({ lands, loading }: DashboardViewProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {[...Array(3)].map((_, i) => <LandCardSkeleton key={i} />)}
      </div>
    )
  }

  if (lands.length === 0) {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>No Lands Found</CardTitle>
                <CardDescription>You do not have any registered lands associated with this wallet address. Register a new land to get started.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {lands.map((land) => (
        <Card key={land.id.toString()} className="flex flex-col">
          <CardHeader>
            <div className='flex justify-between items-start'>
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="text-primary h-5 w-5"/>
                        Land #{land.id.toString()}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-1" title={land.location}>
                        {land.location}
                    </CardDescription>
                </div>
                <Badge variant="secondary">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-3">
            <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground"/>
                <span className="font-medium">{land.ownerName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Hash className="h-4 w-4"/>
                <span className="font-mono text-xs break-all" title={land.ownerAddress}>{land.ownerAddress}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FileText className="h-4 w-4"/>
                <span className="font-mono text-xs break-all" title={land.documentHash}>{land.documentHash}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" size="sm">
                <a href={`https://ipfs.io/ipfs/${land.documentHash}`} target="_blank" rel="noopener noreferrer">
                    View on IPFS
                    <ExternalLink className="h-3 w-3 ml-2" />
                </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
