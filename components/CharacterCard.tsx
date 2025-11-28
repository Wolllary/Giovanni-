import React from 'react';
import { CharacterNFT } from '../types';
import { RARITY_COLORS, COIN_SYMBOL } from '../constants';

interface Props {
  nft: CharacterNFT;
  userAddress: string | null;
  onAction: (nft: CharacterNFT) => void;
  actionLabel: string;
  disabled?: boolean;
}

export const CharacterCard: React.FC<Props> = ({ nft, userAddress, onAction, actionLabel, disabled }) => {
  const isOwner = nft.owner === userAddress;
  const colorClass = RARITY_COLORS[nft.rarity];

  return (
    <div className={`relative group bg-gray-900 border-2 ${colorClass.split(' ')[0]} rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-lg ${colorClass.split(' ')[2]}`}>
      {/* Rarity Badge */}
      <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-black/80 rounded border ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
        {nft.rarity}
      </div>

      <img src={nft.imageUrl} alt={nft.name} className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      
      <div className="p-4">
        <h3 className={`text-xl font-combat uppercase tracking-wide text-white mb-1`}>{nft.name}</h3>
        
        <div className="flex justify-between text-xs text-gray-400 mb-3">
          <span>ATK: <span className="text-red-500 font-bold">{nft.attack}</span></span>
          <span>DEF: <span className="text-blue-500 font-bold">{nft.defense}</span></span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-prese-green font-mono font-bold">
            {nft.price.toLocaleString()} {COIN_SYMBOL}
          </span>
          <button
            onClick={() => onAction(nft)}
            disabled={disabled}
            className={`px-4 py-1.5 text-sm font-bold uppercase rounded 
              ${disabled 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-red-700 hover:bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
              }`}
          >
            {actionLabel}
          </button>
        </div>
        
        <div className="mt-2 text-[10px] text-gray-500 truncate">
          Owner: {nft.owner === 'Marketplace' ? 'Shao Kahn (Market)' : nft.owner.substring(0, 8) + '...'}
        </div>
      </div>
    </div>
  );
};
