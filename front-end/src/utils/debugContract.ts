import { ethers } from 'ethers';
import { LAND_LEDGER_ABI, LAND_LEDGER_CONTRACT_ADDRESS } from '@/lib/constants';

// Simple debug function to test contract interaction
export async function debugContractInteraction() {
  try {
    // Check if MetaMask is available
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('MetaMask is not available');
      return;
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    const account = accounts[0];
    console.log('Connected account:', account);

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Create contract instance
    const contract = new ethers.Contract(
      LAND_LEDGER_CONTRACT_ADDRESS,
      LAND_LEDGER_ABI,
      signer
    );

    console.log('Contract address:', LAND_LEDGER_CONTRACT_ADDRESS);
    console.log('Testing getOwnerLands method...');

    // Test the getOwnerLands method
    try {
      const ownedLandIds = await contract.getOwnerLands(account);
      console.log('Owned land IDs:', ownedLandIds);
      
      if (ownedLandIds.length === 0) {
        console.log('No lands found for this account');
      } else {
        console.log(`Found ${ownedLandIds.length} lands`);
        
        // Test getting land details for each land
        for (const landId of ownedLandIds) {
          const landDetails = await contract.getLandDetails(landId);
          console.log(`Land ${landId}:`, landDetails);
        }
      }
    } catch (error) {
      console.error('Error calling getOwnerLands:', error);
    }

    // Test landCount method
    try {
      const count = await contract.landCount();
      console.log('Total land count:', count.toString());
    } catch (error) {
      console.error('Error calling landCount:', error);
    }

  } catch (error) {
    console.error('Debug error:', error);
  }
}

// Function to check current network
export async function checkNetwork() {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('MetaMask is not available');
    return;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('Current chain ID:', chainId);
    
    // Sepolia chain ID is 0xaa36a7 (11155111 in decimal)
    if (chainId === '0xaa36a7') {
      console.log('Connected to Sepolia network ✅');
    } else {
      console.log('⚠️ Not connected to Sepolia. Please switch to Sepolia network.');
      console.log('Expected chain ID for Sepolia: 0xaa36a7 (11155111)');
    }
  } catch (error) {
    console.error('Error checking network:', error);
  }
}

// Function to switch to Sepolia network
export async function switchToSepolia() {
  if (typeof window === 'undefined' || !window.ethereum) {
    console.error('MetaMask is not available');
    return;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
    });
    console.log('Switched to Sepolia network');
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      console.log('Sepolia network not found in MetaMask, adding it...');
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xaa36a7',
              chainName: 'Sepolia',
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
      } catch (addError) {
        console.error('Error adding Sepolia network:', addError);
      }
    } else {
      console.error('Error switching to Sepolia:', switchError);
    }
  }
}
