import React, { useState } from 'react';
import { CharacterNFT } from '../types';
import { generateBattleCommentary } from '../services/geminiService';

interface Props {
  ownedNFTs: CharacterNFT[];
  allNFTs: CharacterNFT[];
}

export const Arena: React.FC<Props> = ({ ownedNFTs, allNFTs }) => {
  const [selectedFighter, setSelectedFighter] = useState<CharacterNFT | null>(null);
  const [opponent, setOpponent] = useState<CharacterNFT | null>(null);
  const [battleLog, setBattleLog] = useState<string>("");
  const [isFighting, setIsFighting] = useState(false);

  const startFight = async () => {
    if (!selectedFighter) return;

    // Pick random opponent excluding self
    const potentialOpponents = allNFTs.filter(n => n.id !== selectedFighter.id);
    const randomOpponent = potentialOpponents[Math.floor(Math.random() * potentialOpponents.length)];
    setOpponent(randomOpponent);
    setIsFighting(true);
    setBattleLog("INICIANDO COMBATE...");

    try {
        const commentary = await generateBattleCommentary(selectedFighter, randomOpponent);
        
        setTimeout(() => {
            setBattleLog(commentary);
            setIsFighting(false);
        }, 2000);
    } catch (e) {
        setIsFighting(false);
        setBattleLog("Erro na simulação.");
    }
  };

  if (ownedNFTs.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Você precisa comprar um NFT para lutar!</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 bg-[url('https://picsum.photos/id/1050/1200/800')] bg-cover bg-center rounded-lg border-2 border-red-900 relative">
      <div className="absolute inset-0 bg-black/80"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-3xl text-center text-red-600 font-combat tracking-[0.2em] mb-8 glitch-text">ARENA MORTAL</h2>

        <div className="flex justify-between items-center flex-1">
          {/* Player Side */}
          <div className="w-1/3 flex flex-col items-center gap-4">
            {selectedFighter ? (
              <>
                 <img src={selectedFighter.imageUrl} className="w-48 h-64 object-cover border-4 border-green-600 rounded shadow-[0_0_20px_rgba(0,255,0,0.3)]" />
                 <div className="text-center">
                    <h3 className="text-xl font-bold text-white">{selectedFighter.name}</h3>
                    <p className="text-sm text-green-400">ATK: {selectedFighter.attack} | DEF: {selectedFighter.defense}</p>
                 </div>
              </>
            ) : (
                <div className="w-48 h-64 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500">
                    Selecione um Lutador
                </div>
            )}
             <select 
                className="bg-gray-900 text-white p-2 rounded border border-gray-700 w-full max-w-[200px]"
                onChange={(e) => setSelectedFighter(ownedNFTs.find(n => n.id === parseInt(e.target.value)) || null)}
             >
                <option value="">Escolher Guerreiro</option>
                {ownedNFTs.map(nft => (
                    <option key={nft.id} value={nft.id}>{nft.name} ({nft.rarity})</option>
                ))}
             </select>
          </div>

          {/* VS */}
          <div className="text-6xl font-combat text-yellow-600 italic">VS</div>

          {/* Opponent Side */}
          <div className="w-1/3 flex flex-col items-center gap-4">
             {opponent ? (
                 <>
                    <img src={opponent.imageUrl} className="w-48 h-64 object-cover border-4 border-red-600 rounded shadow-[0_0_20px_rgba(255,0,0,0.3)]" />
                     <div className="text-center">
                        <h3 className="text-xl font-bold text-white">{opponent.name}</h3>
                        <p className="text-sm text-red-400">ATK: {opponent.attack} | DEF: {opponent.defense}</p>
                     </div>
                 </>
             ) : (
                <div className="w-48 h-64 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500">
                    Oponente Misterioso
                </div>
             )}
          </div>
        </div>

        {/* Controls / Logs */}
        <div className="mt-8 text-center">
             {!isFighting && (
                 <button 
                    onClick={startFight}
                    disabled={!selectedFighter}
                    className="bg-red-700 hover:bg-red-600 disabled:bg-gray-800 text-white font-combat text-2xl px-12 py-4 rounded shadow-lg transform hover:scale-110 transition-transform"
                 >
                    FIGHT!
                 </button>
             )}
             
             <div className="mt-6 p-4 bg-black/50 border border-red-900 min-h-[80px] flex items-center justify-center">
                 {isFighting ? (
                     <span className="text-yellow-500 animate-pulse font-mono">FIGHTING...</span>
                 ) : (
                     <p className="text-white font-mono text-lg">{battleLog}</p>
                 )}
             </div>
        </div>
      </div>
    </div>
  );
};
