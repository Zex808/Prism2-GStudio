import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, RouteOption, InventoryInsight } from '../types';

// Initialize Gemini Client
// We assume process.env.API_KEY is available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes inventory data to suggest restock rates using Gemini 2.5 Flash.
 * This simulates a complex backend logic determining optimal stock levels.
 */
export const analyzeInventoryItem = async (item: InventoryItem): Promise<InventoryInsight> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze this product for a DSD (Direct Store Delivery) vendor.
    Product: ${item.name}
    Category: ${item.category}
    Current Stock: ${item.currentStock}
    Last Restock: ${item.lastRestockDate}
    Sales Velocity: ${item.salesVelocity} units/day.
    
    Determine if we should increase the restock rate and provide a reasoning.
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedRestockRate: { type: Type.NUMBER, description: "Suggested units to order next time" },
            reasoning: { type: Type.STRING, description: "Why this amount is recommended" },
            urgent: { type: Type.BOOLEAN, description: "Is stock critically low?" },
            itemId: { type: Type.STRING, description: "Return the exact input item ID" }
          },
          required: ["suggestedRestockRate", "reasoning", "urgent"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return { ...data, itemId: item.id };
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback mock data if API fails or key is missing
    return {
      itemId: item.id,
      suggestedRestockRate: item.salesVelocity * 7,
      reasoning: "AI Analysis unavailable. Defaulting to weekly velocity calculation.",
      urgent: false
    };
  }
};

/**
 * Optimizes route selection for a driver based on traffic, weather, and cost.
 * Uses Gemini to reason through the options.
 */
export const optimizeRouteSelection = async (routes: RouteOption[]): Promise<{ selectedRouteId: string; reasoning: string }> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Act as a Logistics Route Optimization Engine.
    Evaluate the following routes for a heavy delivery truck.
    Consider Traffic (avoid heavy), Weather (avoid storms), and Fuel Cost.
    
    Routes:
    ${JSON.stringify(routes)}
    
    Select the best route ID and explain why in a short sentence.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            selectedRouteId: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No optimization data returned");
  } catch (error) {
    console.error("Gemini Route Optimization Failed:", error);
    return {
      selectedRouteId: routes[0].id,
      reasoning: "AI Offline. Defaulting to first available route."
    };
  }
};