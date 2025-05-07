import React, { useState } from 'react';

const UpgradeTier = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTier, setCurrentTier] = useState(0); // Default to Free Tier
  const [selectedTier, setSelectedTier] = useState(0);

  const tiers = [
    { name: "Free Tier", limit: 5, description: "Basic account with limited access" },
    { name: "Standard Tier", limit: 15, description: "Paid subscription with moderate access" },
    { name: "Premium Tier", limit: 30, description: "Premium subscription with expanded access" },
    { name: "Enterprise Tier", limit: 100, description: "Full access for enterprise clients" },
  ];

  const openModal = () => {
    setSelectedTier(currentTier);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleUpdateTier = () => {
    setCurrentTier(selectedTier);
    closeModal();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2">👤</span> Buyer Tier Limits
          </h2>
          <div className="flex items-center">
            <span className="mr-2">Current Tier: <strong>{tiers[currentTier].name}</strong></span>
            <button 
              onClick={openModal}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
            >
              Update Tier
            </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Tier Name</th>
              <th className="py-2">Property Limit</th>
              <th className="py-2">Description</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, index) => (
              <tr key={index} className={`border-b ${currentTier === index ? 'bg-blue-50' : ''}`}>
                <td className="py-2">{tier.name}</td>
                <td className="py-2">
                  <span className="bg-gray-200 px-3 py-1 rounded">{tier.limit}</span> properties
                </td>
                <td className="py-2">{tier.description}</td>
                <td className="py-2">
                  {currentTier === index ? (
                    <span className="text-green-500 font-medium">Current</span>
                  ) : currentTier < index ? (
                    <span className="text-blue-500">Upgrade</span>
                  ) : (
                    <span className="text-gray-400">Downgrade</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tier Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Update Your Tier</h3>
            <p className="mb-4">Select the tier you want to upgrade to:</p>
            
            <div className="space-y-2 mb-6">
              {tiers.map((tier, index) => (
                <label key={index} className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="tier"
                    checked={selectedTier === index}
                    onChange={() => setSelectedTier(index)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">{tier.name}</div>
                    <div className="text-sm text-gray-500">{tier.description}</div>
                    <div className="text-sm">Limit: {tier.limit} properties</div>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={closeModal} 
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateTier} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={selectedTier === currentTier}
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradeTier;