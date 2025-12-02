import { InventoryItem, RouteOption, Driver, DeliveryEvent } from './types';

// Mock Inventory Data
export const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Sparkling Water (Lemon)', currentStock: 45, lastRestockDate: '2023-10-01', salesVelocity: 12, category: 'Beverage' },
  { id: '2', name: 'Energy Drink X', currentStock: 12, lastRestockDate: '2023-10-05', salesVelocity: 25, category: 'Beverage' },
  { id: '3', name: 'Potato Chips (Sea Salt)', currentStock: 80, lastRestockDate: '2023-09-28', salesVelocity: 8, category: 'Snack' },
  { id: '4', name: 'Protein Bar (Chocolate)', currentStock: 150, lastRestockDate: '2023-10-10', salesVelocity: 5, category: 'Snack' },
];

// Mock Route Options for the Driver
export const MOCK_ROUTES: RouteOption[] = [
  {
    id: 'route-a',
    name: 'Highway Route 101',
    distanceKm: 45,
    estimatedTimeMin: 40,
    trafficCondition: 'Clear',
    weatherCondition: 'Sunny',
    fuelCostEstimate: 12.50
  },
  {
    id: 'route-b',
    name: 'City Center (Shortest Distance)',
    distanceKm: 32,
    estimatedTimeMin: 55,
    trafficCondition: 'Heavy',
    weatherCondition: 'Sunny',
    fuelCostEstimate: 10.00
  },
  {
    id: 'route-c',
    name: 'Scenic Coastal Road',
    distanceKm: 50,
    estimatedTimeMin: 45,
    trafficCondition: 'Moderate',
    weatherCondition: 'Rainy',
    fuelCostEstimate: 14.00
  }
];

// Mock Driver Data
export const MOCK_DRIVER: Driver = {
  id: 'd-1',
  name: 'John Doe',
  currentLocation: { lat: 34.0522, lng: -118.2437 },
  status: 'Driving',
  nextStop: '7-Eleven #4205',
  eta: '10:45 AM'
};

// Mock Calendar Data
export const MOCK_DELIVERIES: DeliveryEvent[] = [
  { id: 'evt-1', destination: 'Main St Market', departureTime: '08:00 AM', eta: '08:45 AM', itemsCount: 120, totalValue: 450.00 },
  { id: 'evt-2', destination: 'Downtown Grocery', departureTime: '10:00 AM', eta: '10:30 AM', itemsCount: 50, totalValue: 210.50 },
  { id: 'evt-3', destination: 'Westside Bodega', departureTime: '01:00 PM', eta: '01:50 PM', itemsCount: 200, totalValue: 800.00 },
];