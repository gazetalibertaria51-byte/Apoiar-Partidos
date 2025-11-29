import { GoogleGenAI } from "@google/genai";
import { SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchPartyNews = async (partyName: string): Promise<SearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the latest news, registration status, and controversies regarding the political party "${partyName}" in Brazil. Summarize the current situation in Portuguese in about 3 paragraphs.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Não foi possível obter informações no momento.";
    
    // Extract grounding sources if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web !== undefined && web !== null)
      .map((web: any) => ({
        uri: web.uri,
        title: web.title,
      }));

    return {
      text,
      sources,
    };
  } catch (error) {
    console.error("Error fetching party news:", error);
    return {
      text: "Erro ao carregar notícias. Verifique sua conexão ou a chave de API.",
      sources: []
    };
  }
};