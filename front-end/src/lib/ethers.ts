import { ethers, BrowserProvider, Eip1193Provider, Signer } from 'ethers';
import { LAND_LEDGER_ABI, LAND_LEDGER_CONTRACT_ADDRESS } from './constants';

let provider: BrowserProvider | null = null;
let signer: Signer | null = null;

if (typeof window !== 'undefined' && window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
}

export const getSigner = async (): Promise<Signer | null> => {
    if (!provider) return null;
    signer = await provider.getSigner();
    return signer;
}

export const getLandLedgerContract = async (signerOrProvider: Signer | BrowserProvider | null = null) => {
    let contractSignerOrProvider = signerOrProvider;
    if (!contractSignerOrProvider) {
        if (signer) {
            contractSignerOrProvider = signer;
        } else if (provider) {
            const currentSigner = await getSigner();
            if(currentSigner) {
                contractSignerOrProvider = currentSigner;
            } else {
                contractSignerOrProvider = provider;
            }
        } else {
            throw new Error("No signer or provider available.");
        }
    }
    
    return new ethers.Contract(LAND_LEDGER_CONTRACT_ADDRESS, LAND_LEDGER_ABI, contractSignerOrProvider);
}

export const getProvider = () => {
    return provider;
}
