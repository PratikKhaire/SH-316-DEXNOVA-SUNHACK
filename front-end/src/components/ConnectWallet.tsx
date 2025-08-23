"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { getProvider, getSigner, switchToSepolia } from '@/lib/ethers';
import { Wallet, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConnectWalletProps {
  onConnect: (account: string | null) => void;
}

export function ConnectWallet({ onConnect }: ConnectWalletProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    try {
      const signer = await getSigner();
      if (signer) {
        const address = await signer.getAddress();
        setAccount(address);
        onConnect(address);
        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
        });
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
        description: err.message || "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [onConnect, toast]);

  const disconnectWallet = () => {
    setAccount(null);
    onConnect(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
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
      ethereum.on('accountsChanged', handleAccountsChanged);
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
          console.log("Could not check for existing connection:", error);
        }
      }
    };
    
    checkConnection();

    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [onConnect]);

  if (account) {
    return (
      <div className="flex items-center gap-2">
        <span 
          className="text-sm font-medium text-muted-foreground hidden sm:inline"
          title={account}
        >
          {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={disconnectWallet}
          aria-label="Disconnect wallet"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button 
        onClick={connectWallet} 
        disabled={isConnecting}
        className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight hover:bg-gray-800 transition-colors"
        aria-label={isConnecting ? "Connecting wallet..." : "Connect wallet"}
      >
        <Wallet className="h-4 w-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </div>
  );
}
