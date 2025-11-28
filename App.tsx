import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_CHARACTERS, COIN_NAME, COIN_SYMBOL, COIN_URL } from './constants';
import { CharacterNFT, ChatMessage, User } from './types';
import { CharacterCard } from './components/CharacterCard';
import { Chat } from './components/Chat';
import { Arena } from './components/Arena';
import { generateMarketChat } from './services/geminiService';

declare global {
  interface Window {
    solana?: any;
  }
}

const App: React.FC = () => {
  // --- Game State ---
  const [view, setView] = useState<'MARKET' | 'ARENA' | 'INVENTORY'>('MARKET');
  const [nfts, setNfts] = useState<CharacterNFT[]>(INITIAL_CHARACTERS);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // --- Wallet Logic (Simulated for Demo) ---
  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        const address = resp.publicKey.toString();
        setWalletAddress(address);
        // Simulate airdrop on connect
        setBalance(1000000); 
        addSystemMessage(`Carteira conectada: ${address.slice(0,6)}...`);
      } catch (err) {
        console.error("User rejected connection", err);
      }
    } else {
      alert("Phantom Wallet não encontrada! Por favor instale a extensão.");
      window.open('https://phantom.app/', '_blank');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(0);
  };

  // --- Market Logic ---
  const handleBuy = async (nft: CharacterNFT) => {
    if (!walletAddress) {
      alert("Conecte sua carteira Phantom primeiro!");
      return;
    }
    if (balance < nft.price) {
      alert(`Saldo insuficiente de ${COIN_SYMBOL}!`);
      return;
    }

    // Process Transaction (Mock)
    setBalance(prev => prev - nft.price);
    
    // Update NFT Ownership
    setNfts(prev => prev.map(n => n.id === nft.id ? { ...n, owner: walletAddress } : n));

    // Announce
    const announcerMsg = await generateMarketChat(nft.name, nft.price, walletAddress);
    addSystemMessage(announcerMsg);
  };

  const handleSell = (nft: CharacterNFT) => {
    // Return to marketplace
    // Refund 80% (20% fee simulation)
    const refund = Math.floor(nft.price * 0.8);
    setBalance(prev => prev + refund);
    setNfts(prev => prev.map(n => n.id === nft.id ? { ...n, owner: 'Marketplace' } : n));
    addSystemMessage(`${walletAddress?.slice(0,6)} vendeu ${nft.name} de volta ao mercado.`);
  };

  // --- Chat Logic ---
  const addSystemMessage = (text: string) => {
    const msg: ChatMessage = {
      id: Math.random().toString(36),
      sender: 'SYSTEM',
      text,
      timestamp: Date.now(),
      isSystem: true
    };
    setMessages(prev => [...prev, msg]);
  };

  const handleUserMessage = (text: string) => {
    if (!walletAddress) return;
    const msg: ChatMessage = {
      id: Math.random().toString(36),
      sender: walletAddress,
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, msg]);
  };

  // --- Derived State ---
  const myNfts = useMemo(() => nfts.filter(n => n.owner === walletAddress), [nfts, walletAddress]);
  const marketNfts = useMemo(() => nfts.filter(n => n.owner === 'Marketplace'), [nfts]);

  return (
    <div className="min-h-screen bg-prese-dark text-white flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-black/90 border-b border-gray-800 p-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-combat text-2xl animate-pulse">
               MK
             </div>
             <div>
               <h1 className="text-2xl font-combat tracking-wider text-white uppercase glitch-text">Arena <span className="text-prese-green">Presercoin</span></h1>
               <a href={COIN_URL} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 underline">
                 Comprar $PRESE na Pump.fun
               </a>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex gap-2 bg-gray-900 p-1 rounded-lg">
              <button onClick={() => setView('MARKET')} className={`px-4 py-1 rounded uppercase text-sm font-bold transition-colors ${view === 'MARKET' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Mercado</button>
              <button onClick={() => setView('ARENA')} className={`px-4 py-1 rounded uppercase text-sm font-bold transition-colors ${view === 'ARENA' ? 'bg-red-800 text-white' : 'text-gray-500 hover:text-red-400'}`}>Arena</button>
              <button onClick={() => setView('INVENTORY')} className={`px-4 py-1 rounded uppercase text-sm font-bold transition-colors ${view === 'INVENTORY' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Inventário ({myNfts.length})</button>
            </nav>

            <div className="flex items-center gap-4">
              {walletAddress ? (
                <div className="flex items-center gap-3 bg-gray-900 border border-prese-green/30 px-4 py-2 rounded-full">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">Saldo</span>
                    <span className="text-prese-green font-mono font-bold">{balance.toLocaleString()} {COIN_SYMBOL}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-700 mx-1"></div>
                  <button onClick={disconnectWallet} className="text-xs text-red-500 hover:text-red-400 uppercase font-bold">Sair</button>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded font-bold transition-all shadow-[0_0_15px_rgba(147,51,234,0.5)] flex items-center gap-2"
                >
                  <img src="https://cryptologos.cc/logos/phantom-phantom-logo.png?v=025" className="w-5 h-5" alt="Phantom"/>
                  Conectar Phantom
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left/Center: Dynamic View */}
        <div className="lg:col-span-3 min-h-[600px]">
          {view === 'MARKET' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold border-l-4 border-prese-green pl-3">NFTs Disponíveis ({marketNfts.length})</h2>
                <div className="text-sm text-gray-400">Raridades: Comum a Lendário</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketNfts.map(nft => (
                  <CharacterCard 
                    key={nft.id} 
                    nft={nft} 
                    userAddress={walletAddress}
                    onAction={handleBuy}
                    actionLabel="Comprar"
                    disabled={!walletAddress}
                  />
                ))}
              </div>
            </div>
          )}

          {view === 'INVENTORY' && (
            <div className="space-y-4">
               <h2 className="text-xl font-bold border-l-4 border-purple-500 pl-3">Seus Guerreiros ({myNfts.length})</h2>
               {myNfts.length === 0 ? (
                 <div className="text-center py-20 text-gray-500 bg-gray-900/50 rounded-lg">
                    Você não possui NFTs. Vá ao mercado e use PRESE para recrutar!
                 </div>
               ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myNfts.map(nft => (
                    <CharacterCard 
                      key={nft.id} 
                      nft={nft} 
                      userAddress={walletAddress}
                      onAction={handleSell}
                      actionLabel="Vender (80%)"
                    />
                  ))}
                </div>
               )}
            </div>
          )}

          {view === 'ARENA' && (
             <Arena ownedNFTs={myNfts} allNFTs={nfts} />
          )}
        </div>

        {/* Right: Sidebar / Chat */}
        <div className="lg:col-span-1 h-[600px] lg:sticky lg:top-24">
          <Chat messages={messages} onSendMessage={handleUserMessage} currentUser={walletAddress} />
          
          <div className="mt-4 p-4 bg-gray-900/80 rounded border border-gray-800">
             <h3 className="text-prese-green font-bold text-sm mb-2 uppercase">Status do Token</h3>
             <div className="space-y-2 text-xs text-gray-400">
               <div className="flex justify-between">
                 <span>Moeda:</span> <span className="text-white">{COIN_NAME}</span>
               </div>
               <div className="flex justify-between">
                 <span>Ticker:</span> <span className="text-white">{COIN_SYMBOL}</span>
               </div>
               <div className="flex justify-between">
                 <span>Contrato:</span> <span className="text-white truncate w-24">Cxhm...pump</span>
               </div>
               <div className="w-full h-px bg-gray-800 my-2"></div>
               <p className="text-[10px] leading-tight text-gray-500">
                 Todas as transações são simuladas nesta demo. Conecte Phantom para interagir com a interface.
               </p>
             </div>
          </div>
        </div>

      </main>

      <footer className="bg-black py-8 text-center text-gray-600 text-sm border-t border-gray-900">
        <p>Arena Presercoin &copy; 2024. Powered by Solana & Gemini.</p>
        <p className="text-xs mt-1">Este é um projeto de demonstração.</p>
      </footer>
    </div>
  );
};

export default App;
