// Defines the structure for inventory items
export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  lastRestockDate: string;
  salesVelocity: number; // units per day
  category: string;
}

// Defines the structure for AI-generated inventory insights
export interface InventoryInsight {
  itemId: string;
  suggestedRestockRate: number;
  reasoning: string;
  urgent: boolean;
}

// Defines a delivery route option
export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  estimatedTimeMin: number;
  trafficCondition: 'Clear' | 'Moderate' | 'Heavy';
  weatherCondition: 'Sunny' | 'Rainy' | 'Stormy';
  fuelCostEstimate: number;
}

// Defines a driver profile
export interface Driver {
  id: string;
  name: string;
  currentLocation: { lat: number; lng: number }; // Mock coords
  status: 'Driving' | 'Delivering' | 'Idle';
  nextStop: string;
  eta: string;
}

// Defines a calendar event for deliveries
export interface DeliveryEvent {
  id: string;
  destination: string;
  departureTime: string;
  eta: string;
  itemsCount: number;
  totalValue: number;
}

// Defines a chat message
export interface Message {
  id: string;
  sender: 'Vendor' | 'Driver';
  text: string;
  timestamp: Date;
}