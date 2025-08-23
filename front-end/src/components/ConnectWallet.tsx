
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { getProvider, getSigner } from '@/lib/ethers';
import { Wallet, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConnectWalletProps {
  onConnect: (account: string | null) => void;
}

export function ConnectWallet({ onConnect }: ConnectWalletProps) {
  const [account, setAccount] = useState<string | null>(null);
  const { toast } = useToast();

  const connectWallet = useCallback(async () => {
    try {
      const signer = await getSigner();
      if (signer) {
        const address = await signer.getAddress();
        setAccount(address);
        onConnect(address);
      } else {
        toast({
            title: "Wallet not found",
            description: "Please install MetaMask to connect your wallet.",
            variant: "destructive"
        });
      }
    } catch (err: any) {
        toast({
            title: "Connection Failed",
            description: "Failed to connect wallet. Please try again.",
            variant: "destructive"
        });
      console.error(err);
    }
  }, [onConnect, toast]);

  const disconnectWallet = () => {
    setAccount(null);
    onConnect(null);
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        const newAccount = accounts[0];
        setAccount(newAccount);
        onConnect(newAccount);
      }
    };
    
    const ethereum = window.ethereum;
    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged as any);
    }

    const checkConnection = async () => {
        const provider = getProvider();
        if (provider) {
            try {
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0].address);
                    onConnect(accounts[0].address);
                }
            } catch (error) {
                // This can happen if the user has revoked permissions
                console.log("Could not check for existing connection:", error);
            }
        }
    }
    checkConnection();

    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged as any);
      }
    };
  }, [onConnect]);

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
          {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
        </span>
        <Button variant="outline" size="sm" onClick={disconnectWallet}>
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    </div>
  );
}
