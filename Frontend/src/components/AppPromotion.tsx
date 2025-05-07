import React from 'react';

const AppPromoSection: React.FC = () => {
  return (
    <div className="bg-orange-50 p-8 rounded-lg mx-4 my-6 relative flex justify-between items-center">
      <div className="max-w-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Download Legacy land Real Estate Mobile App</h1>
        <p className="text-gray-600 mb-6">and never miss out any update</p>
        
        <div className="mb-4 flex items-start">
          <span className="text-blue-600 mr-2 font-bold">✓</span>
          <span className="text-gray-700">Get to know about newly posted properties as soon as they are posted</span>
        </div>
        
        <div className="mb-6 flex items-start">
          <span className="text-blue-600 mr-2 font-bold">✓</span>
          <span className="text-gray-700">Manage your properties with ease and get instant alerts about responses</span>
        </div>
        
        <div className="flex mt-6">
          <div className="bg-black rounded mr-4 h-10 w-32 flex items-center justify-center">
            <img src="/api/placeholder/120/36" alt="Google Play" className="h-8" />
          </div>
          <div className="bg-black rounded h-10 w-32 flex items-center justify-center">
            <img src="/api/placeholder/120/36" alt="App Store" className="h-8" />
          </div>
        </div>
      </div>
      
      <div className="relative hidden md:block">
        <div className="relative">
          <img src="/api/placeholder/300/500" alt="Mobile App Screenshot" className="rounded-xl shadow-lg" />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white py-2 px-4 rounded-full shadow flex items-center font-bold text-gray-800">
            <span className="text-blue-600 mr-2">⬇️</span>
            <span>5M+ Downloads</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPromoSection;