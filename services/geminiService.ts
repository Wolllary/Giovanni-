import { GoogleGenAI } from "@google/genai";
import { CharacterNFT } from "../types";

// Note: Using a dummy key check to prevent crashing if environment variable is missing,
// but relying on the system instruction that process.env.API_KEY is available.
const apiKey = process.env.API_KEY || 'dummy_key';
const ai = new GoogleGenAI({ apiKey });

export const generateBattleCommentary = async (fighter1: CharacterNFT, fighter2: CharacterNFT): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, intense, Mortal Kombat style battle description (2 sentences max) between ${fighter1.name} (Attack: ${fighter1.attack}) and ${fighter2.name} (Attack: ${fighter2.attack}). Mention a special move. Ends with a winner based on higher stats. Portuguese language.`,
    });
    return response.text || "A batalha foi intensa, mas apenas um sobreviveu!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `A arena treme enquanto ${fighter1.name} e ${fighter2.name} colidem!`;
  }
};

export const generateMarketChat = async (nftName: string, price: number, buyer: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a sinister Mortal Kombat arena announcer (like Shao Kahn). Announce that player ${buyer.substring(0,6)} has acquired the soul of ${nftName} for ${price} coins. Short and scary. Portuguese language.`,
    });
    return response.text || `${buyer} adquiriu ${nftName}!`;
  } catch (error) {
    return `ALERTA: ${nftName} foi comprado por ${buyer.substring(0,4)}...`;
  }
}
