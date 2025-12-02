import React, { useState, useEffect } from 'react';
import { MOCK_INVENTORY, MOCK_DELIVERIES, MOCK_DRIVER } from '../constants';
import { InventoryItem, InventoryInsight } from '../types';
import { analyzeInventoryItem } from '../services/geminiService';

const VendorDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [insights, setInsights] = useState<Record<string, InventoryInsight>>({});
  const [loadingInsight, setLoadingInsight] = useState<string | null>(null);

  const handleAnalyze = async (item: InventoryItem) => {
    if (insights[item.id]) return; // Already analyzed
    setLoadingInsight(item.id);
    try {
      const insight = await analyzeInventoryItem(item);
      setInsights(prev => ({ ...prev, [item.id]: insight }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInsight(null);
    }
  };

  const renderInventory = () => (
    <div className="space-y-4 pb-24 px-4 pt-4">
      <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
      <div className="grid gap-4">
        {inventory.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.currentStock < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                Stock: {item.currentStock}
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
               <span>Velocity: {item.salesVelocity}/day</span>
               <span>Last: {item.lastRestockDate}</span>
            </div>

            {insights[item.id] ? (
              <div className="mt-2 bg-blue-50 border border-blue-100 p-3 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2 mb-1">
                   <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>
                   <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Gemini Insight</span>
                </div>
                <p className="text-sm text-gray-800 mb-1">{insights[item.id].reasoning}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-blue-900">Recommended Order: {insights[item.id].suggestedRestockRate} units</span>
                    {insights[item.id].urgent && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">Urgent</span>}
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleAnalyze(item)}
                disabled={loadingInsight === item.id}
                className="w-full mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg text-sm font-medium shadow hover:shadow-md transition-all flex justify-center items-center gap-2"
              >
                {loadingInsight === item.id ? (
                  <>Analyzing...</>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Analyze Reorder Rate
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="pb-24 px-4 pt-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Portal</h1>
          <p className="text-gray-500 text-sm">Welcome back, Manager.</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
           <img src="https://picsum.photos/100/100" alt="Profile" />
        </div>
      </div>

      {/* Driver Tracking Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <h3 className="font-semibold text-gray-700">Live Driver Tracking</h3>
           <span className="flex items-center gap-1 text-green-600 text-xs font-bold px-2 py-1 bg-green-50 rounded-full animate-pulse">
             <span className="w-2 h-2 bg-green-500 rounded-full"></span> LIVE
           </span>
        </div>
        <div className="relative h-48 bg-gray-100 w-full">
            {/* Simulated Map Visual */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10" 
                 style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>
            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 50 150 Q 150 50 300 100" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="5,5" />
              <circle cx="50" cy="150" r="6" fill="#ef4444" /> {/* Start */}
              <circle cx="300" cy="100" r="6" fill="#22c55e" /> {/* End */}
            </svg>
            {/* Driver Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-lg flex items-center gap-3">
               <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2v0a2 2 0 012 2m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2" /></svg>
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-900">{MOCK_DRIVER.name}</p>
                 <p className="text-xs text-gray-500">Next: {MOCK_DRIVER.nextStop}</p>
                 <p className="text-xs text-blue-600 font-medium">ETA: {MOCK_DRIVER.eta}</p>
               </div>
            </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
            <p className="text-indigo-100 text-sm">Total Deliveries</p>
            <p className="text-3xl font-bold">24</p>
            <p className="text-xs text-indigo-200 mt-1">+12% from yesterday</p>
         </div>
         <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm">Pending Restocks</p>
            <p className="text-3xl font-bold text-gray-800">5</p>
            <p className="text-xs text-red-500 mt-1">2 Urgent</p>
         </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="pb-24 px-4 pt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Schedule</h2>
      <div className="space-y-4">
         {MOCK_DELIVERIES.map((evt, idx) => (
           <div key={evt.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                 <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                 <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>
              </div>
              <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-2">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800">{evt.destination}</h4>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono">{evt.eta}</span>
                 </div>
                 <div className="flex justify-between text-sm text-gray-500">
                    <span>{evt.itemsCount} Items</span>
                    <span>${evt.totalValue.toFixed(2)}</span>
                 </div>
                 {idx === 0 && (
                   <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                     <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs py-2 rounded font-medium transition-colors">
                       Modify Order
                     </button>
                     <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs py-2 rounded font-medium transition-colors">
                       Contact Driver
                     </button>
                   </div>
                 )}
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  switch (activeTab) {
    case 'inventory': return renderInventory();
    case 'calendar': return renderCalendar();
    default: return renderDashboard();
  }
};

export default VendorDashboard;