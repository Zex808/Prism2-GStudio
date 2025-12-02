import React, { useState } from 'react';
import { MOCK_ROUTES } from '../constants';
import { RouteOption } from '../types';
import { optimizeRouteSelection } from '../services/geminiService';

const DriverRoute: React.FC = () => {
  const [routes, setRoutes] = useState<RouteOption[]>(MOCK_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(MOCK_ROUTES[0].id);
  const [optimizationResult, setOptimizationResult] = useState<{ id: string; reasoning: string } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizeRouteSelection(routes);
      setOptimizationResult({ id: result.selectedRouteId, reasoning: result.reasoning });
      setSelectedRouteId(result.selectedRouteId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const selectedRoute = routes.find(r => r.id === selectedRouteId);

  return (
    <div className="pb-24 px-4 pt-4 h-screen flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Route Planner</h1>
        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          ONLINE
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gray-200 rounded-xl h-64 w-full mb-6 relative overflow-hidden shadow-inner border border-gray-300">
         <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">Navigation Map</p>
         </div>
         {/* Simple visualization of selected route */}
         <svg className="absolute inset-0 w-full h-full">
            <path d="M 40 200 C 100 200, 150 100, 300 50" fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="40" cy="200" r="8" fill="white" stroke="#2563eb" strokeWidth="3"/>
            <circle cx="300" cy="50" r="8" fill="#ef4444" stroke="white" strokeWidth="2"/>
         </svg>
         
         <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded shadow-lg text-xs">
           <p className="font-bold">Next Turn</p>
           <p>Right on Market St (2.5km)</p>
         </div>
      </div>

      {/* AI Optimization Section */}
      {!optimizationResult && !isOptimizing && (
        <button 
          onClick={handleOptimize}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg mb-6 flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          AI Optimize Route
        </button>
      )}

      {isOptimizing && (
        <div className="w-full bg-white p-4 rounded-xl shadow mb-6 border border-blue-100 flex items-center justify-center gap-3">
           <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           <span className="text-blue-600 font-medium">Analyzing Traffic & Weather...</span>
        </div>
      )}

      {optimizationResult && (
        <div className="mb-6 bg-purple-50 border border-purple-200 p-4 rounded-xl animate-fade-in">
           <div className="flex items-center gap-2 mb-2">
             <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>
             <h3 className="font-bold text-purple-800">Recommendation</h3>
           </div>
           <p className="text-sm text-purple-900 mb-3">{optimizationResult.reasoning}</p>
           <button 
             onClick={() => { setOptimizationResult(null); }}
             className="text-xs text-purple-600 underline"
           >
             Recalculate
           </button>
        </div>
      )}

      {/* Route List */}
      <h3 className="font-bold text-gray-700 mb-3">Available Routes</h3>
      <div className="space-y-3 overflow-y-auto flex-1">
        {routes.map(route => (
          <div 
            key={route.id}
            onClick={() => setSelectedRouteId(route.id)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selectedRouteId === route.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-transparent bg-white shadow-sm hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
               <span className="font-bold text-gray-800">{route.name}</span>
               {selectedRouteId === route.id && <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Selected</span>}
            </div>
            
            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
               <div className="flex items-center gap-1">
                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 {route.estimatedTimeMin} mins
               </div>
               <div className="flex items-center gap-1">
                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 {route.distanceKm} km
               </div>
               <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    route.trafficCondition === 'Clear' ? 'bg-green-500' : 
                    route.trafficCondition === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  {route.trafficCondition} Traffic
               </div>
               <div className="flex items-center gap-1">
                  <span className="text-xs font-mono bg-gray-200 px-1 rounded">${route.fuelCostEstimate.toFixed(2)} Fuel</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverRoute;