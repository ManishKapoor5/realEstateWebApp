import React, { useState, useEffect } from 'react';
import { Save, Users, AlertCircle, Info } from 'lucide-react';
import { TierLimit, LimitConfig } from '../types';
import { useLimitConfigStore } from '../store/limitConfigStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PropertyLimitConfiguration: React.FC = () => {
  // Use store hooks at the component level, not within functions
  const {
    limitConfig,
    isLoading,
    error,
    fetchLimitConfig,
    updateLimitConfig,
    clearError,
  } = useLimitConfigStore();

  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [buyerTiers, setBuyerTiers] = useState<TierLimit[]>([]);
  const [showLimitExceededNotice, setShowLimitExceededNotice] = useState<boolean>(true);
  const [allowWaitlist, setAllowWaitlist] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { accessToken } = useAuthStore(); 
  // Fetch configuration on component mount
  useEffect(() => {
  if (!accessToken) {
    toast.error('Session expired. Please log in again.');
    logout(); // Optional, if you want to clear the state
    navigate('/login');
  }
}, [accessToken, logout, navigate]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        await fetchLimitConfig();
      } catch (error) {
        console.error('API fetch failed:', error);
        if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
          toast.error('Unauthorized: Please log in again');
          logout();
          navigate('/login');
        } else {
          // Attempt to load from backup if API fails
          const backupConfig = localStorage.getItem('limitConfigBackup');
          if (backupConfig) {
            try {
              const parsedConfig: LimitConfig = JSON.parse(backupConfig);
              setBuyerTiers(parsedConfig.tiers);
              setShowLimitExceededNotice(parsedConfig.showLimitExceededNotice);
              setAllowWaitlist(parsedConfig.allowWaitlist);
            } catch (e) {
              console.error('Failed to parse backup config:', e);
            }
          }
        }
      }
    };
    
    fetchConfig();
  }, [fetchLimitConfig, logout, navigate]);

  // Update local state when limitConfig changes
  useEffect(() => {
    if (limitConfig && limitConfig.tiers) {
      setBuyerTiers(limitConfig.tiers);
      setShowLimitExceededNotice(limitConfig.showLimitExceededNotice);
      setAllowWaitlist(limitConfig.allowWaitlist);
    }
  }, [limitConfig]);

  // Handle and display errors from the store
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Update a specific tier's property limit
  const updatePropertyLimit = (tierId: string, newLimit: string): void => {
    const limit = parseInt(newLimit);
    if (isNaN(limit) || limit < 0) return;

    setBuyerTiers((tiers) =>
      tiers.map((tier) =>
        tier.id === tierId ? { ...tier, propertyLimit: limit } : tier
      )
    );

    setIsSaved(false);
    setSaveError(null);
  };

  // Save configuration
  const saveConfiguration = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const hasInvalidLimits = buyerTiers.some(
        (tier: TierLimit) => tier.propertyLimit === 0 || tier.propertyLimit > 500
      );
      
      if (hasInvalidLimits) {
        setSaveError('Property limits must be between 1 and 500');
        return;
      }
      
      const updatedConfig: LimitConfig = {
        tiers: buyerTiers,
        showLimitExceededNotice,
        allowWaitlist,
      };
      
      console.log('Saving config:', updatedConfig);
      await updateLimitConfig(updatedConfig);
      localStorage.setItem('limitConfigBackup', JSON.stringify(updatedConfig));
      
      setIsSaved(true);
      toast.success('Property limit configuration saved successfully');
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error: unknown) {
      let errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to save configuration';
        
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'Unauthorized: Please log in again';
        logout();
        navigate('/login');
      }
      
      setSaveError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading || !limitConfig) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Property Viewing Limit Configuration</h1>
        <p className="text-gray-600 mt-2">
          Control how many properties buyers can view based on their account tier.
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200 flex items-start">
        <div className="text-blue-500 mr-3 mt-1">
          <Info size={20} />
        </div>
        <div>
          <h3 className="font-medium text-blue-800">Configuration Guide</h3>
          <p className="text-blue-700 text-sm">
            Set the maximum number of properties each buyer tier can view.
            The system will automatically enforce these limits for property viewing.
          </p>
        </div>
      </div>

      <form onSubmit={saveConfiguration}>
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-gray-500" />
            Buyer Tier Property Limits
          </h2>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="grid grid-cols-12 mb-2 text-sm font-medium text-gray-500 border-b border-gray-200 pb-2">
              <div className="col-span-4">Tier Name</div>
              <div className="col-span-3">Property Limit</div>
              <div className="col-span-5">Description</div>
            </div>

            {buyerTiers && buyerTiers.length > 0 ? (
              buyerTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="grid grid-cols-12 py-3 border-b border-gray-100 items-center"
                >
                  <div className="col-span-4 font-medium text-gray-700">{tier.name}</div>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={tier.propertyLimit}
                        onChange={(e) => updatePropertyLimit(tier.id, e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="ml-2 text-gray-500 text-sm">properties</span>
                    </div>
                  </div>
                  <div className="col-span-5 text-sm text-gray-600">{tier.description}</div>
                </div>
              ))
            ) : (
              <div className="py-3 text-gray-500">No tiers available</div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-gray-500" />
            Limit Behavior Settings
          </h2>

          <div className="space-y-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="limitNotice"
                checked={showLimitExceededNotice}
                onChange={() => setShowLimitExceededNotice(!showLimitExceededNotice)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="limitNotice" className="font-medium text-gray-700">
                  Show limit exceeded notice
                </label>
                <p className="text-gray-500 text-sm">
                  Display a notification when buyers reach their property viewing limit
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="waitlist"
                checked={allowWaitlist}
                onChange={() => setAllowWaitlist(!allowWaitlist)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor="waitlist" className="font-medium text-gray-700">
                  Allow waitlist for additional properties
                </label>
                <p className="text-gray-500 text-sm">
                  Enable buyers to join a waitlist for properties beyond their limit
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </>
            )}
          </button>
        </div>

        {isSaved && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-center">
            Property limit configuration saved successfully!
          </div>
        )}

        {saveError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-center">
            {saveError}
          </div>
        )}
      </form>
    </div>
  );
};

export default PropertyLimitConfiguration;