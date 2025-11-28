export enum Rarity {
  COMMON = 'COMUM',
  UNCOMMON = 'INCOMUM',
  RARE = 'RARO',
  EPIC = 'ÉPICO',
  LEGENDARY = 'LENDÁRIO',
}

export interface CharacterNFT {
  id: number;
  name: string;
  rarity: Rarity;
  price: number;
  owner: string; // 'Marketplace' or Wallet Address
  imageUrl: string;
  attack: number;
  defense: number;
  description: string;
}

export interface User {
  walletAddress: string;
  balance: number;
  inventory: number[]; // IDs of owned NFTs
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface WalletContextState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  buyNFT: (nft: CharacterNFT) => Promise<boolean>;
  sellNFT: (nftId: number) => Promise<boolean>;
}
