import React, { useState } from 'react';
import Navigation from './components/Navigation';
import VendorDashboard from './components/VendorDashboard';
import DriverRoute from './components/DriverRoute';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  // Simulating user role switching
  const [currentMode, setMode] = useState<'vendor' | 'driver'>('vendor');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Helper to handle switching tabs when mode changes
  const handleModeChange = (newMode: 'vendor' | 'driver') => {
    setMode(newMode);
    setActiveTab(newMode === 'vendor' ? 'dashboard' : 'route');
  };

  const renderContent = () => {
    if (activeTab === 'messages') {
      return <ChatInterface currentUser={currentMode === 'vendor' ? 'Vendor' : 'Driver'} />;
    }

    if (currentMode === 'vendor') {
      return <VendorDashboard activeTab={activeTab} />;
    } else {
      // Driver Mode
      if (activeTab === 'route') {
        return <DriverRoute />;
      }
      return <div>View not found</div>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200">
      <main className="h-full">
        {renderContent()}
      </main>
      
      <Navigation 
        currentMode={currentMode}
        setMode={handleModeChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default App;