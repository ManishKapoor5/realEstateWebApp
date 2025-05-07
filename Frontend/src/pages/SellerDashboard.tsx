import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PropertyForm from '@/components/PropertyForm';
import PropertyCard from '@/components/PropertyCard';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/services/axiosInstance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { BookUser, Users, Filter, SortAsc, SortDesc, Download, BarChart, PieChart, AlertCircle, RefreshCw } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { saveAs } from 'file-saver';
import axios from 'axios';

// Modified Property interface to include approval status
interface Property {
  _id: string;
  title: string;
  type: string;
  price: number | string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  status: string;
  approval: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  features?: string[];
  description?: string;
  images?: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Placeholder for analytics
const trackEvent = (event: string, data: Record<string, any>) => {
  console.log(`Analytics: ${event}`, data);
};

const SellerDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'properties' | 'add' | 'rejected'>('properties');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold'>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, accessToken, user, refreshToken } = useAuthStore.getState();

  const showToast = useCallback(({ title, description, variant = 'default' }) => {
    toast({
      title,
      description,
      variant: variant as "default" | "destructive",
      duration: 3000, // 3 seconds in milliseconds
    });
  }, [toast]);

  // Geolocation
  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            trackEvent('Geolocation Success', { latitude: position.coords.latitude, longitude: position.coords.longitude });
          },
          (err) => {
            console.error('Geolocation error:', err);
            setError('Failed to get your location. You can still add properties without location data.');
            showToast({ variant: 'destructive', title: 'Geolocation Error', description: 'Unable to retrieve location.' });
            trackEvent('Geolocation Error', { error: err.message });
          },
          { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
        showToast({ variant: 'destructive', title: 'Geolocation Error', description: 'Geolocation not supported.' });
      }
    };

    requestLocation();
  }, [showToast]);

  // Authentication and data fetching
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      await Promise.all([fetchProperties()]);
      setLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, accessToken, navigate, page, filterStatus, approvalFilter, sortBy, sortOrder, searchQuery]);

  // Fetch properties
  const fetchProperties = useCallback(async () => {
    console.log('===== FETCH PROPERTIES CALLED =====');
    try {
      setLoading(true);
      if (!accessToken) {
        throw new Error('Authentication token missing');
      }

      const params = {
        page,
        limit: 9,
        status: filterStatus === 'all' ? undefined : filterStatus,
        approvalStatus: approvalFilter === 'all' ? undefined : approvalFilter,
        sortBy,
        sortOrder,
        search: searchQuery || undefined,
      };

      const response = await axiosInstance.get(`/Property/properties/seller/${user._id}`, { params });
      console.log('✅ API call succeeded:', response.data);

      const { data, totalPages: total } = response.data;
      setProperties(data || []);
      setTotalPages(total || 1);
      trackEvent('Fetch Properties Success', { userId: user._id, page, count: data?.length });
    } catch (err: any) {
      console.error('❌ API call failed:', err);
      if (err.response?.status === 401) {
        try {
          await useAuthStore.getState().refreshToken;
          await fetchProperties();
        } catch (refreshErr) {
          setError('Session expired. Please log in again.');
          navigate('/login');
          showToast({ variant: 'destructive', title: 'Authentication Error', description: 'Session expired.' });
        }
      } else {
        setError(err.message || 'Failed to fetch properties');
        showToast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to fetch properties' });
      }
      trackEvent('Fetch Properties Error', { error: err.message });
    } finally {
      setLoading(false);
      console.log('===== FETCH DONE =====');
    }
  }, [accessToken, user._id, page, filterStatus, approvalFilter, sortBy, sortOrder, searchQuery, navigate, showToast]);

  // Handle view details
  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    trackEvent('View Property Details', { propertyId: property._id, title: property.title });
  };

  // Handle close details
  const handleCloseDetails = () => {
    setSelectedProperty(null);
    trackEvent('Close Property Details', {});
  };

  // Handle delete property
  const handleDeleteProperty = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this property?');
    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete(`/Property/delete/${id}`);
      if (response.status === 200) {
        setProperties((prev) => prev.filter((prop) => prop._id !== id));
        showToast({ title: 'Success', description: 'Property deleted successfully' });
        trackEvent('Delete Property Success', { propertyId: id });
      } else {
        throw new Error('Delete failed with status ' + response.status);
      }
    } catch (err: any) {
      console.error('Error deleting property:', err);
      showToast({ variant: 'destructive', title: 'Error', description: 'Failed to delete property' });
      trackEvent('Delete Property Error', { propertyId: id, error: err.message });
    }
  };

  // Handle resubmission of rejected property
  const handleResubmitProperty = async (property: Property) => {
    try {
      // Update the property to pending status and remove rejection reason
      const updatedData = {
        ...property,
        approvalStatus: 'pending',
        rejectionReason: undefined
      };
      
      const response = await axiosInstance.put(`/Property/update/${property._id}`, updatedData);
      
      if (response.status === 200) {
        // Update local state
        setProperties(properties.map(p => 
          p._id === property._id ? { ...p, approvalStatus: 'pending', rejectionReason: undefined } : p
        ));
        
        showToast({ title: 'Success', description: 'Property resubmitted for approval' });
        trackEvent('Resubmit Property', { propertyId: property._id });
        
        // If we're in the rejected tab, refresh to show updated properties
        if (activeTab === 'rejected') {
          fetchProperties();
        }
      }
    } catch (err: any) {
      console.error('Error resubmitting property:', err);
      showToast({ variant: 'destructive', title: 'Error', description: 'Failed to resubmit property' });
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      trackEvent('Change Page', { page: newPage });
    }
  };

  // Get approval status badge
  const getApprovalBadge = (approval: string) => {
    switch (approval) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">Approved</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">Rejected</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">Pending Approval</span>;
    }
  };

  // Enhanced PropertyCard to show approval status
  const PropertyCardWithApproval = ({ property }: { property: Property }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{property.title}</h3>
            {getApprovalBadge(property.approval)}
          </div>
          <p className="text-gray-600 mt-1">
            {property.location.address}, {property.location.city}
          </p>
          <p className="text-primary font-bold mt-2">
            ₹{typeof property.price === 'string' 
              ? parseInt(property.price).toLocaleString('en-IN')
              : property.price.toLocaleString('en-IN')}
          </p>
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-4">
              {property.bedrooms && (
                <span className="text-sm text-gray-500">{property.bedrooms} Beds</span>
              )}
              {property.bathrooms && (
                <span className="text-sm text-gray-500">{property.bathrooms} Baths</span>
              )}
              {property.area && (
                <span className="text-sm text-gray-500">{property.area} sq.ft</span>
              )}
            </div>
          </div>
          
          {property.approval === 'rejected' && property.rejectionReason && (
            <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-800">Rejected Reason:</p>
                  <p className="text-xs text-red-700">{property.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewDetails(property)}
            >
              View Details
            </Button>
            
            {property.approval === 'rejected' && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleResubmitProperty(property)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className="mr-1 h-3 w-3" /> Resubmit
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => handleDeleteProperty(property._id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Filtered properties based on selected tab and filters
  const getFilteredProperties = () => {
    let filtered = [...properties];
    
    if (activeTab === 'rejected') {
      // Only show rejected properties in the rejected tab
      filtered = filtered.filter(p => p.approval === 'rejected');
    } else {
      // Do not show rejected properties in the main properties tab
      filtered = filtered.filter(p => p.approval !== 'rejected');
      
      // Apply approval filter if not on rejected tab
      if (approvalFilter !== 'all') {
        filtered = filtered.filter(p => p.approval === approvalFilter);
      }
      
      // Apply property status filter
      if (filterStatus !== 'all') {
        filtered = filtered.filter(p => p.status === filterStatus);
      }
    }
    
    // Apply search query for both tabs
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.location.address.toLowerCase().includes(query) ||
        p.location.city.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const filteredProperties = getFilteredProperties();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your property listings and track buyer interest</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'properties' | 'add' | 'rejected')}>
        <TabsList className="mb-6">
          <TabsTrigger value="properties">My Properties</TabsTrigger>
          <TabsTrigger value="add">Add New Property</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | 'active' | 'sold')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={approvalFilter} 
              onValueChange={(value) => setApprovalFilter(value as 'all' | 'pending' | 'approved')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approvals</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'price' | 'date')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-[120px]"
            >
              {sortOrder === 'asc' ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>

          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Properties need admin approval before becoming visible to buyers. Pending properties will be reviewed by our team.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No properties match your current filters.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCardWithApproval key={property._id} property={property} />
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-2">
                <Button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="py-2 px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="add">
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> All new properties require admin approval before they become visible to buyers. Our team will review your listing within 24-48 hours.
            </p>
          </div>
          <PropertyForm
            userLocation={userLocation}
            onSuccess={() => {
              setActiveTab('properties');
              fetchProperties();
              toast({ title: 'Success', description: 'Property added successfully and is pending approval' });
              trackEvent('Add Property Success', {});
            }}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search rejected properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              You don't have any rejected properties.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCardWithApproval key={property._id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
                  <div className="mt-1">{getApprovalBadge(selectedProperty.approval)}</div>
                </div>
                <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedProperty.approval === 'rejected' && selectedProperty.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800">Rejection Reason:</p>
                      <p className="text-red-700">{selectedProperty.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <PropertyCard
                title={selectedProperty.title}
                price={typeof selectedProperty.price === 'string' ? parseFloat(selectedProperty.price) : selectedProperty.price}
                location={`${selectedProperty.location.address}, ${selectedProperty.location.city}, ${selectedProperty.location.state}, ${selectedProperty.location.country}`}
                property={{ 
                  ...selectedProperty, 
                  description: selectedProperty.description || '', // Ensure description is included
                  features: {
                    bedrooms: selectedProperty.bedrooms || 0,
                    bathrooms: selectedProperty.bathrooms || 0,
                    area: selectedProperty.area || 0,
                    parking: false, // Default value
                    furnished: false // Default value
                  },
                  owner: { 
                    name: user.fullName || 'Unknown', 
                    email: user.email, 
                    contact: user.contactNumber.toString() || 'N/A' 
                  },
                  location: {
                    ...selectedProperty.location,
                    postalCode: selectedProperty.location.coordinates?.latitude ? 'N/A' : 'N/A',
                    latitude: selectedProperty.location.coordinates?.latitude || 0,
                    longitude: selectedProperty.location.coordinates?.longitude || 0
                  }
                }}
                user={user}
                showDetailedView={true}
              />
              
              {selectedProperty.approval === 'rejected' && (
                <div className="mt-4">
                  <Button 
                    onClick={() => {
                      handleResubmitProperty(selectedProperty);
                      handleCloseDetails();
                    }}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Resubmit for Approval
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SellerDashboard;