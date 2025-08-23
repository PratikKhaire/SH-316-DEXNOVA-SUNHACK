"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Land } from '@/lib/types';
import { getLandLedgerContract, getSigner } from '@/lib/ethers';
import { useToast } from "@/hooks/use-toast";
import { ethers } from 'ethers';

export const useLandLedger = (account: string | null) => {
    const [lands, setLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const fetchLands = useCallback(async () => {
        if (!account) {
            setLands([]);
            return;
        };
        setLoading(true);
        try {
            const contract = await getLandLedgerContract();
            const ownedLandIds: bigint[] = await contract.getOwnerLands(account);
            
            const landDetailsPromises = ownedLandIds.map(id => contract.getLandDetails(id));
            const landDetails = await Promise.all(landDetailsPromises);

            const validLands = landDetails.filter(land => land.exists);
            setLands(validLands as Land[]);
        } catch (error) {
            console.error("Error fetching lands:", error);
            toast({
                title: "Error",
                description: "Could not fetch your land assets.",
                variant: "destructive",
            });
            setLands([]);
        } finally {
            setLoading(false);
        }
    }, [account, toast]);

    useEffect(() => {
        fetchLands();
    }, [fetchLands]);

    const registerLand = async (data: { location: string; ownerName: string; documentHash: string; }) => {
        if (!account) return;
        setLoading(true);
        try {
            const signer = await getSigner();
            if (!signer) throw new Error("Wallet not connected");

            const contract = await getLandLedgerContract(signer);
            const tx = await contract.registerLand(data.location, data.ownerName, data.documentHash);
            
            toast({ title: "Processing Transaction", description: "Waiting for blockchain confirmation..." });
            await tx.wait();
            
            toast({ title: "Success", description: "Land registered successfully!" });
            fetchLands();
        } catch (error: any) {
            console.error("Error registering land:", error);
            toast({
                title: "Registration Failed",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const transferLand = async (data: { landId: string; newOwnerAddress: string; newOwnerName: string; }) => {
        if (!account) return;
        setLoading(true);
        try {
            const signer = await getSigner();
            if (!signer) throw new Error("Wallet not connected");

            const contract = await getLandLedgerContract(signer);
            const tx = await contract.transferOwnership(data.landId, data.newOwnerAddress, data.newOwnerName);

            toast({ title: "Processing Transaction", description: "Waiting for blockchain confirmation..." });
            await tx.wait();

            toast({ title: "Success", description: "Ownership transferred successfully!" });
            fetchLands();
        } catch (error: any) {
            console.error("Error transferring ownership:", error);
            toast({
                title: "Transfer Failed",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return { lands, loading, registerLand, transferLand, fetchLands };
};
