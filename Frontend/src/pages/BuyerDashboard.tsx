import { useState, useEffect, useCallback } from 'react';
import { Home, User, Heart, Bell, Search, Filter, Map, Grid, ChevronDown, Check, MapPin, AlertCircle, X } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import Header from '@/components/Header';
import { useLimitConfigStore } from '../store/limitConfigStore';
import { useNavigate } from 'react-router-dom';
import  usePropertyStore  from '@/store/propertyStore';
import { useAuthStore } from '@/store/authStore';
// Types based on provided MongoDB structure
interface User {
  _id: string;
  fullName: string;
  email: string;
  contactNumber: string | number;
  role: 'admin' | 'agent' | 'seller' | 'buyer';
  status: 'pending' | 'active' | 'inactive';
  isVerified: boolean;
  tier?: 'free' | 'standard' | 'premium' | 'enterprise' | 'agent';
}

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area?: number;
    parking: boolean;
    furnished: boolean;
  };
  owner: {
    name: string;
    email: string;
    contact: string;
  };
  images: string[];
  status: string;
  approval?: string;
  sellerId?: string;
  createdAt?: string;
}

interface PropertyView {
  propertyId: string;
  viewedAt: Date;
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

// Mock user data with tier
const mockUser: User = {
  _id: "6800af9dd05f2945ddeb6f46",
  fullName: "Ethen Hunt",
  email: "ethenhunt@gmail.com",
  contactNumber: 7677326761,
  role: "buyer",
  status: "active",
  isVerified: true,
  tier: "free"
};

export default function BuyerDashboard() {
  const [user, setUser] = useState<User>(mockUser);
  const [properties, setProperties] = useState<Property[]>([]);
  //const [viewedProperties, setViewedProperties] = useState<PropertyView[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'favorites' | 'profile'>('browse');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000000000,
    bedrooms: 0,
    bathrooms: 0,
    propertyType: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "New property matching your search criteria", read: false },
    { id: 2, message: "Price drop on property in your favorites", read: false }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedPropertyForView, setSelectedPropertyForView] = useState<Property | null>(null);
  const [actualRemaining,setActualRemaining] = useState()
  const { limitConfig, getTierById, getUserPropertyLimit, fetchLimitConfig } = useLimitConfigStore();
  const navigate = useNavigate();

const viewedProperties = usePropertyStore((state) => state.viewedProperties);
  const setViewedProperties = usePropertyStore((state) => state.setViewedProperties);
  const favoriteProperties = usePropertyStore((state) => state.favoriteProperties);
  const setFavoriteProperties = usePropertyStore((state) => state.setFavoriteProperties);
  const reset = usePropertyStore((state) => state.reset);
  
  
  // Logout function
  const logout = useCallback(() => {
    // Clear auth-related data (adjust based on your auth setup)
    localStorage.removeItem('jwt_token'); // Example: Remove token
    // Reset Zustand store
    reset();
    // Navigate to login page
    navigate('/login');
  }, [reset, navigate]);

   // Check for missing token on mount
  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      logout();
    }
  }, [logout]);


  // Axios interceptor for 401 errors (only handle token expiration)
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Check if the error is due to token expiration
          // Adjust the condition based on your API's error response
          const isTokenExpired =
            error.response.data?.message?.toLowerCase().includes('token expired') ||
            error.response.data?.error?.toLowerCase().includes('token expired');
          if (isTokenExpired) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  // User property limit logic
  const userPropertyLimit = getUserPropertyLimit(user.tier || 'free');
  const remainingViews = userPropertyLimit - viewedProperties.length;
  const hasReachedLimit = remainingViews <= 0;

  // Initialize limit config
  useEffect(() => {
    useLimitConfigStore.getState().initialize();
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchLimitConfig();
      const response = await axiosInstance.get('/Property/getAll');
      if (response.data?.data) {
        setProperties(response.data.data);
      }
      // No need for localStorage.getItem; Zustand persist middleware handles loading
      // viewedProperties and favoriteProperties are already loaded by the store
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchLimitConfig]);

  useEffect(() => {
    fetchData();
    return () => {};
  }, [fetchData]);

  // No need for useEffect to save to localStorage; Zustand persist middleware handles it

  // Toggle favorite
  const toggleFavorite = useCallback((propertyId: string) => {
    setFavoriteProperties(
      favoriteProperties.includes(propertyId)
        ? favoriteProperties.filter((id) => id !== propertyId)
        : [...favoriteProperties, propertyId]
    );
  }, [favoriteProperties, setFavoriteProperties]);

  // Format price
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  // Check if property is new
  const isNewProperty = useCallback((createdAt?: string) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      priceMin: 0,
      priceMax: 1000000000,
      bedrooms: 0,
      bathrooms: 0,
      propertyType: 'all',
    });
    setSearchQuery('');
  }, []);

  // Check if property has been viewed
  const hasViewedProperty = useCallback(
    (propertyId: string) => {
      return viewedProperties.some((view) => view.propertyId === propertyId);
    },
    [viewedProperties]
  );

  // Handle view property
  const handleViewProperty = useCallback(
    (property: Property) => {
      if (hasViewedProperty(property._id)) {
        console.log(`View details for property ${property._id}`);
        navigate(`/individual-property/${property._id}`);
        return;
      }
      if (hasReachedLimit) {
        setSelectedPropertyForView(property);
        setShowLimitModal(true);
        return;
      }
      const newView: PropertyView = {
        propertyId: property._id,
        viewedAt: new Date(),
      };
      setViewedProperties([...viewedProperties, newView]);
      console.log(`View details for property ${property._id}`);
      navigate(`/individual-property/${property._id}`);
    },
    [hasReachedLimit, hasViewedProperty, viewedProperties, setViewedProperties, navigate]
  );

  const handleUpgradeTier = () => {
    console.log("Navigate to tier upgrade page");
     const tierId = user.tier || 'free'; // Replace with the correct logic to get the tier ID
     navigate(`/upgradeTier?tierId=${tierId}`);
    setShowLimitModal(false);
  };

  const handleJoinWaitlist = () => {
    if (selectedPropertyForView) {
      console.log(`Add user to waitlist for property ${selectedPropertyForView._id}`);
      const newNotification: Notification = {
        id: Date.now(),
        message: `You've been added to the waitlist for ${selectedPropertyForView.title}`,
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
    setShowLimitModal(false);
    setSelectedPropertyForView(null);
  };

  const markNotificationAsRead = useCallback((notificationId: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const filteredProperties = properties.filter(property => {
    if (property.price < filters.priceMin || property.price > filters.priceMax) return false;
    if (filters.bedrooms > 0 && property.features.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms > 0 && property.features.bathrooms < filters.bathrooms) return false;
    if (filters.propertyType !== 'all' && property.type.toLowerCase() !== filters.propertyType.toLowerCase()) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const locationString = `${property.location.address} ${property.location.city} ${property.location.state} ${property.location.country}`.toLowerCase();
      return (
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        locationString.includes(query) ||
        property.type.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* View limit indicator */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Property Views</h3>
              <p className="text-sm text-gray-600">
                {remainingViews > 0 
                  ? `You have ${remainingViews} property views remaining this month` 
                  : "You've reached your property viewing limit this month"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 rounded-full p-2 w-20 h-3 relative">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full bg-blue-600" 
                  style={{ 
                    width: `${Math.min(100, (viewedProperties.length / userPropertyLimit) * 100)}%`,
                    transition: 'width 0.3s ease'
                  }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{viewedProperties.length}/{userPropertyLimit}</span>
            </div>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              onClick={handleUpgradeTier}
            >
              Upgrade Tier
            </button>
          </div>
        </div>

        <div className="md:hidden flex justify-between mb-4 bg-white p-2 rounded-lg shadow-sm">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`flex flex-col items-center px-3 py-2 ${activeTab === 'browse' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Browse</span>
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center px-3 py-2 ${activeTab === 'favorites' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs mt-1">Favorites</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center px-3 py-2 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>

        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Browse Properties</h2>
              <div className="flex items-center space-x-2">
                <button 
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button 
                  className={`p-2 rounded ${viewMode === 'map' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setViewMode('map')}
                >
                  <Map className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Search by location, property type, keywords..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5 mr-1" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 ml-1 transform ${showFilters ? 'rotate-180' : ''} transition-transform`} />
              </button>
            </div>
            {showFilters && (
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                        <input 
                          type="number"
                          placeholder="Min"
                          className="w-full pl-8 p-2 border border-gray-300 rounded-lg"
                          value={filters.priceMin || ''}
                          onChange={(e) => setFilters({...filters, priceMin: Number(e.target.value) || 0})}
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                        <input 
                          type="number"
                          placeholder="Max"
                          className="w-full pl-8 p-2 border border-gray-300 rounded-lg"
                          value={filters.priceMax || ''}
                          onChange={(e) => setFilters({...filters, priceMax: Number(e.target.value) || 1000000000})}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={filters.bedrooms}
                      onChange={(e) => setFilters({...filters, bedrooms: Number(e.target.value)})}
                    >
                      <option value={0}>Any</option>
                      <option value={1}>1+</option>
                      <option value={2}>2+</option>
                      <option value={3}>3+</option>
                      <option value={4}>4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={filters.bathrooms}
                      onChange={(e) => setFilters({...filters, bathrooms: Number(e.target.value)})}
                    >
                      <option value={0}>Any</option>
                      <option value={1}>1+</option>
                      <option value={2}>2+</option>
                      <option value={3}>3+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={filters.propertyType}
                      onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                    >
                      <option value="all">All Types</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button 
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                    onClick={clearFilters}
                  >
                    Reset
                  </button>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-6 rounded-lg shadow-sm text-center">
                <p className="text-red-600">{error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={fetchData}
                >
                  Try Again
                </button>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Search className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No properties found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your filters or search criteria</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <div key={property._id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                    <div className="relative h-48">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image Available</span>
                        </div>
                      )}
                      <button 
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm transition-colors hover:bg-gray-50"
                        onClick={() => toggleFavorite(property._id)}
                        aria-label={favorites.includes(property._id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`h-5 w-5 ${favorites.includes(property._id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                      </button>
                      {isNewProperty(property.createdAt) && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                      {property.approval === 'approved' && (
                        <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                      {hasViewedProperty(property._id) && (
                        <span className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Viewed
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
                        <p className="text-lg font-bold text-blue-600">{formatPrice(property.price)}</p>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{property.location.city}, {property.location.state}</span>
                      </div>
                      <div className="flex items-center text-gray-500 mb-3 flex-wrap gap-2">
                        <span className="text-sm">{property.features.bedrooms} beds</span>
                        <span className="text-sm">{property.features.bathrooms} baths</span>
                        {property.features.area && (
                          <span className="text-sm">{property.features.area} sqft</span>
                        )}
                      </div>
                      <button 
                        className={`w-full rounded-lg py-2 transition-colors ${
                          hasViewedProperty(property._id) 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                            : hasReachedLimit 
                              ? 'bg-gray-300 text-gray-600 hover:bg-gray-400' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => handleViewProperty(property)}
                      >
                        {hasViewedProperty(property._id) ? 'View Again' : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Map className="h-12 w-12 mx-auto mb-2" />
                  <p>Map view would be implemented here</p>
                  <p className="text-sm">Using latitude/longitude from property data</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Favorites</h2>
            {favorites.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Heart className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-3 text-lg font-medium text-gray-900">No favorites yet</h3>
                <p className="text-gray-500 mt-2">Browse properties and add some to your favorites</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => setActiveTab('browse')}
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.filter(p => favorites.includes(p._id)).map(property => (
                  <div key={property._id} className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                    <div className="relative h-48">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image Available</span>
                        </div>
                      )}
                      <button 
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
                        onClick={() => toggleFavorite(property._id)}
                        aria-label="Remove from favorites"
                      >
                        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                      </button>
                      {hasViewedProperty(property._id) && (
                        <span className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Viewed
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
                        <p className="text-lg font-bold text-blue-600">{formatPrice(property.price)}</p>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm truncate">{property.location.city}, {property.location.state}</span>
                      </div>
                      <div className="flex items-center text-gray-500 mb-3 flex-wrap gap-2">
                        <span className="text-sm">{property.features.bedrooms} beds</span>
                        <span className="text-sm">{property.features.bathrooms} baths</span>
                        {property.features.area && (
                          <span className="text-sm">{property.features.area} sqft</span>
                        )}
                      </div>
                      <button 
                        className={`w-full rounded-lg py-2 transition-colors ${
                          hasViewedProperty(property._id) 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                            : hasReachedLimit 
                              ? 'bg-gray-300 text-gray-600 hover:bg-gray-400' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => handleViewProperty(property)}
                      >
                        {hasViewedProperty(property._id) ? 'View Again' : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-gray-900">{user.fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <p className="mt-1 text-gray-900">{user.contactNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Status</label>
                      <p className="mt-1 text-gray-900 capitalize">{user.status}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Membership Tier</label>
                      <p className="mt-1 text-gray-900 capitalize">{user.tier}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                  {notifications.length === 0 ? (
                    <div className="text-center py-4">
                      <Bell className="h-12 w-12 mx-auto text-gray-300" />
                      <p className="mt-2 text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg flex justify-between items-center ${
                            notification.read ? 'bg-gray-50' : 'bg-blue-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <Bell className="h-5 w-5 mr-2 text-gray-500" />
                            <p className={notification.read ? 'text-gray-600' : 'text-gray-900'}>
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => console.log("Navigate to edit profile page")}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Limit Reached Modal */}
        {showLimitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">View Limit Reached</h3>
                </div>
                <button onClick={() => setShowLimitModal(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                You've reached your monthly property view limit for the {user.tier} tier. Upgrade your tier to view more properties or join the waitlist for this property.
              </p>
              {selectedPropertyForView && (
                <p className="text-gray-900 font-medium mb-4">
                  Property: {selectedPropertyForView.title}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                  onClick={handleJoinWaitlist}
                >
                  Join Waitlist
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={handleUpgradeTier}
                >
                  Upgrade Tier
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}