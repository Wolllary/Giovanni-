import { Rarity, CharacterNFT } from './types';

export const COIN_NAME = 'Presercoin';
export const COIN_SYMBOL = 'PRESE';
export const COIN_URL = 'https://pump.fun/coin/CxhmEXEjQPiqpKF1Ro1X8UcovDgfqCbHZgMV6csHpump';

export const PRICES = {
  [Rarity.COMMON]: 10000,
  [Rarity.UNCOMMON]: 50000,
  [Rarity.RARE]: 150000,
  [Rarity.EPIC]: 300000,
  [Rarity.LEGENDARY]: 500000,
};

export const RARITY_COLORS = {
  [Rarity.COMMON]: 'border-gray-400 text-gray-400 shadow-gray-500/20',
  [Rarity.UNCOMMON]: 'border-green-500 text-green-500 shadow-green-500/20',
  [Rarity.RARE]: 'border-blue-500 text-blue-500 shadow-blue-500/20',
  [Rarity.EPIC]: 'border-purple-500 text-purple-500 shadow-purple-500/20',
  [Rarity.LEGENDARY]: 'border-yellow-500 text-yellow-500 shadow-yellow-500/20',
};

const NAMES = [
  "Melissa", "Void Zero", "Toxic Reptile", "Thunder God", "Shadow Monk",
  "Iron Jax", "Blade Empress", "Sorcerer Quan", "Kano Cyber", "Liu Fire",
  "Johnny Star", "Sonya Blade", "Night Wolf", "Sector Red", "Cyrax Yellow",
  "Smoke Grey", "Noob Shadow", "Ermac Soul", "Rain Prince", "Jade Green",
  "Kitana Blue", "Mileena Pink", "Sindel Scream", "Shao Kahn", "Goro Giant",
  "Kintaro Beast", "Motaro Horse", "Baraka Tooth", "Kabal Speed", "Stryker Cop",
  "Sheeva Arms", "Shang Tsung", "Kung Lao", "Liu Kang", "Raiden",
  "Sub-Zero", "Scorpion", "Reptile", "Kano", "Sonya",
  "Jax", "Kitana", "Mileena", "Jade", "Smoke",
  "Noob Saibot", "Ermac", "Rain", "Chameleon", "Khameleon"
];

// Helper to generate deterministic pseudo-random distribution
const generateCharacters = (): CharacterNFT[] => {
  const chars: CharacterNFT[] = [];
  
  // Distribution: 20 Common, 15 Uncommon, 10 Rare, 4 Epic, 1 Legendary
  const rarities = [
    ...Array(20).fill(Rarity.COMMON),
    ...Array(15).fill(Rarity.UNCOMMON),
    ...Array(10).fill(Rarity.RARE),
    ...Array(4).fill(Rarity.EPIC),
    ...Array(1).fill(Rarity.LEGENDARY),
  ];

  for (let i = 0; i < 50; i++) {
    const rarity = rarities[i];
    chars.push({
      id: i + 1,
      name: NAMES[i] || `Fighter ${i + 1}`,
      rarity: rarity,
      price: PRICES[rarity],
      owner: 'Marketplace',
      imageUrl: `https://picsum.photos/seed/${i + 99}/300/400`, // Fixed seed for consistent images
      attack: Math.floor(Math.random() * 100) + (Object.values(Rarity).indexOf(rarity) * 20),
      defense: Math.floor(Math.random() * 100) + (Object.values(Rarity).indexOf(rarity) * 20),
      description: `Um guerreiro ${rarity.toLowerCase()} pronto para a arena.`
    });
  }
  return chars;
};

export const INITIAL_CHARACTERS = generateCharacters();
