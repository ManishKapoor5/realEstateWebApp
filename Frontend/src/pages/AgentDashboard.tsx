// // src/pages/Dashboard/AgentDashboard.tsx
// import React, { useState, useEffect, useCallback } from 'react';
// import Layout from '@/components/Layout';
// import PropertyCard from '@/components/PropertyCard';
// import PropertyForm from '@/components/PropertyForm';
// //import { getUserProperties, getAllProperties } from '../services/api';
// import { Property } from '../types';
// import axiosInstance from '@/services/axiosInstance';
// import { useAuthStore } from '@/store/authStore';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '@/hooks/use-toast';
// import axios from 'axios';
// // Placeholder for analytics
// const trackEvent = (event: string, data: Record<string, any>) => {
//   console.log(`Analytics: ${event}`, data);
// };

// const AgentDashboard: React.FC = ()  => {
//   const [myProperties, setMyProperties] = useState<Property[]>([]);
//   const [allProperties, setAllProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState<'myProperties' | 'allProperties' | 'add'>('myProperties');
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold'>('all');
//   const [sortBy, setSortBy] = useState<'price' | 'date'>('date');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
//   const [searchQuery, setSearchQuery] = useState('');

//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { isAuthenticated, accessToken, user, refreshToken } = useAuthStore.getState();
  
  
//     const showToast = useCallback(({ title, description, variant = 'default' }) => {
//       toast({
//         title,
//         description,
//         variant: variant as "default" | "destructive",
//         duration: 3000, // 3 seconds in milliseconds
//       });
//     }, [toast]);

//   useEffect(() => {
//     const checkAuth = async () => {
//       if (!isAuthenticated) {
//         navigate('/login');
//         return;
//       }
//       await Promise.all([fetchProperties()]);
//       setLoading(false);
//     };

//     checkAuth();
//   }, [isAuthenticated, accessToken, navigate, page, filterStatus, sortBy, sortOrder, searchQuery]);

//   // Fetch properties
//   const fetchProperties = useCallback(async () => {
//     console.log('===== FETCH PROPERTIES CALLED =====');
//     try {
//       setLoading(true);
//       if (!accessToken) {
//         throw new Error('Authentication token missing');
//       }

//       const params = {
//         page,
//         limit: 9,
//         status: filterStatus === 'all' ? undefined : filterStatus,
//         sortBy,
//         sortOrder,
//         search: searchQuery || undefined,
//       };

//       const response = await axiosInstance.get(`/Property/properties/agent/${user._id}`, { params });
//       console.log('✅ API call succeeded:', response.data);

//       const { data, totalPages: total } = response.data;
//       setMyProperties(data || []);
//       setTotalPages(total || 1);
//       trackEvent('Fetch Properties Success', { userId: user._id, page, count: data?.length });
//     } catch (err: any) {
//       console.error('❌ API call failed:', err);
//       if (err.response?.status === 401) {
//         try {
//           await useAuthStore.getState().refreshToken;
//           await fetchProperties();
//         } catch (refreshErr) {
//           setError('Session expired. Please log in again.');
//           navigate('/login');
//           showToast({ variant: 'destructive', title: 'Authentication Error', description: 'Session expired.' });
//         }
//       } else {
//         setError(err.message || 'Failed to fetch properties');
//         showToast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to fetch properties' });
//       }
//       trackEvent('Fetch Properties Error', { error: err.message });
//     } finally {
//       setLoading(false);
//       console.log('===== FETCH DONE =====');
//     }
//   }, [accessToken, user._id, page, filterStatus, sortBy, sortOrder, searchQuery, navigate, toast, refreshToken]);

//   const handleViewDetails = (property: Property) => {
//     setSelectedProperty(property);
//   };

//   const handleCloseDetails = () => {
//     setSelectedProperty(null);
//   };

//   return (
//     <Layout>
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
//         <p className="text-gray-600">Manage properties and connect buyers with sellers</p>
//       </div>

//       <div className="mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex">
//             <button
//               onClick={() => setActiveTab('myProperties')}
//               className={`py-4 px-6 font-medium text-sm ${
//                 activeTab === 'myProperties'
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               My Listings
//             </button>
//             <button
//               onClick={() => setActiveTab('allProperties')}
//               className={`py-4 px-6 font-medium text-sm ${
//                 activeTab === 'allProperties'
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               All Properties
//             </button>
//             <button
//               onClick={() => setActiveTab('add')}
//               className={`py-4 px-6 font-medium text-sm ${
//                 activeTab === 'add'
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Add New Property
//             </button>
//           </nav>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       ) : error ? (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error}
//         </div>
//       ) : activeTab === 'myProperties' ? (
//         <>
//           {myProperties.length === 0 ? (
//             <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//               You haven't listed any properties yet.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {myProperties.map((property) => (
//                 <PropertyCard
//                   key={property._id}
//                   title={property.title}
//                   price={typeof property.price === 'string' ? parseFloat(property.price) : property.price}
//                   location={`${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
//                   property={property}
//                   onViewDetails={handleViewDetails}
//                 />
//               ))}
//             </div>
//           )}
//         </>
//       ) : activeTab === 'allProperties' ? (
//         <>
//           {allProperties.length === 0 ? (
//             <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//               No properties are currently listed.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {allProperties.map((property) => (
//                 <PropertyCard
//                   key={property._id}
//                   title={property.title}
//                   price={typeof property.price === 'string' ? parseFloat(property.price) : property.price}
//                   location={`${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
//                   property={property}
//                   onViewDetails={handleViewDetails}
//                 />
//               ))}
//             </div>
//           )}
//         </>
//       ) : (
//         <PropertyForm userLocation={null} />
//       )}

//       {selectedProperty && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
//                 <button
//                   onClick={handleCloseDetails}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <PropertyCard
//                 title={selectedProperty.title}
//                 price={typeof selectedProperty.price === 'string' ? parseFloat(selectedProperty.price) : selectedProperty.price}
//                 location={`${selectedProperty.location.address}, ${selectedProperty.location.city}, ${selectedProperty.location.state}, ${selectedProperty.location.country}`}
//                 property={selectedProperty}
//                 showDetailedView={true}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// };

// export default AgentDashboard;

// import React, { useState, useEffect, useCallback } from 'react';
// import Layout from '@/components/Layout';
// import PropertyCard from '@/components/PropertyCard';
// import PropertyForm from '@/components/PropertyForm';
// import axiosInstance from '@/services/axiosInstance';
// import { useAuthStore } from '@/store/authStore';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '@/hooks/use-toast';
// import { Property } from '../types';

// // Analytics placeholder
// const trackEvent = (event: string, data: Record<string, any>) => {
//   console.log(`Analytics: ${event}`, data);
// };

// const AgentDashboard: React.FC = () => {
//   const [myProperties, setMyProperties] = useState<Property[]>([]);
//   const [allProperties, setAllProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState<'myProperties' | 'allProperties' | 'add'>('myProperties');
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold'>('all');
//   const [sortBy, setSortBy] = useState<'price' | 'date'>('date');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
//   const [searchQuery, setSearchQuery] = useState('');

//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const { isAuthenticated, accessToken, user } = useAuthStore();

//   const showToast = useCallback(
//     ({ title, description, variant = 'default' }: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
//       toast({
//         title,
//         description,
//         variant,
//         duration: 3000,
//       });
//     },
//     [toast]
//   );

//   useEffect(() => {
//     const checkAuth = async () => {
//       if (!isAuthenticated) {
//         navigate('/login');
//         return;
//       }
//       await Promise.all([fetchMyProperties(), fetchAllProperties()]);
//       setLoading(false);
//     };

//     checkAuth();
//   }, [isAuthenticated, navigate, page, filterStatus, sortBy, sortOrder, searchQuery]);

//   // Fetch my properties
//   const fetchMyProperties = useCallback(async () => {
//     try {
//       setLoading(true);
//       if (!accessToken || !user?._id) {
//         throw new Error('Authentication token or user ID missing');
//       }

//       const params = {
//         page,
//         limit: 9,
//         status: filterStatus === 'all' ? undefined : filterStatus,
//         sortBy,
//         sortOrder,
//         search: searchQuery || undefined,
//       };

//       const response = await axiosInstance.get(`/Property/properties/agent/${user._id}`, { params });
//       const { data, totalPages: total } = response.data;
//       setMyProperties(data || []);
//       setTotalPages(total || 1);
//       trackEvent('Fetch My Properties Success', { userId: user._id, page, count: data?.length });
//     } catch (err: any) {
//       handleError(err, 'Failed to fetch my properties');
//     } finally {
//       setLoading(false);
//     }
//   }, [accessToken, user?._id, page, filterStatus, sortBy, sortOrder, searchQuery]);

//   // Fetch all properties
//   const fetchAllProperties = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page,
//         limit: 9,
//         status: filterStatus === 'all' ? undefined : filterStatus,
//         sortBy,
//         sortOrder,
//         search: searchQuery || undefined,
//       };

//       const response = await axiosInstance.get('/Property/properties', { params });
//       const { data, totalPages: total } = response.data;
//       setAllProperties(data || []);
//       setTotalPages(total || 1);
//       trackEvent('Fetch All Properties Success', { page, count: data?.length });
//     } catch (err: any) {
//       handleError(err, 'Failed to fetch all properties');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, filterStatus, sortBy, sortOrder, searchQuery]);

//   // Handle errors
//   const handleError = async (err: any, defaultMessage: string) => {
//     console.error('❌ API call failed:', err);
//     if (err.response?.status === 401) {
//       try {
//         await useAuthStore.getState().refreshToken;
//         await Promise.all([fetchMyProperties(), fetchAllProperties()]);
//       } catch (refreshErr) {
//         setError('Session expired. Please log in again.');
//         navigate('/login');
//         showToast({ variant: 'destructive', title: 'Authentication Error', description: 'Session expired.' });
//       }
//     } else {
//       const message = err.message || defaultMessage;
//       setError(message);
//       showToast({ variant: 'destructive', title: 'Error', description: message });
//     }
//     trackEvent('Fetch Properties Error', { error: err.message });
//   };

//   const handleViewDetails = (property: Property) => {
//     setSelectedProperty(property);
//   };

//   const handleCloseDetails = () => {
//     setSelectedProperty(null);
//   };

//   return (
//     <Layout>
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
//         <p className="text-gray-600">Manage properties and connect buyers user</p>
//       </div>

//       {/* Filters and Search */}
//       <div className="mb-6 flex flex-col md:flex-row gap-4">
//         <input
//           type="text"
//           placeholder="Search properties..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border rounded px-4 py-2"
//         />
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'sold')}
//           className="border rounded px-4 py-2"
//         >
//           <option value="all">All Status</option>
//           <option value="active">Active</option>
//           <option value="sold">Sold</option>
//         </select>
//         <select
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value as 'price' | 'date')}
//           className="border rounded px-4 py-2"
//         >
//           <option value="price">Price</option>
//           <option value="date">Date</option>
//         </select>
//         <select
//           value={sortOrder}
//           onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
//           className="border rounded px-4 py-2"
//         >
//           <option value="asc">Ascending</option>
//           <option value="desc">Descending</option>
//         </select>
//       </div>

//       {/* Tabs */}
//       <div className="mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex">
//             {['myProperties', 'allProperties', 'add'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab as 'myProperties' | 'allProperties' | 'add')}
//                 className={`py-4 px-6 font-medium text-sm ${
//                   activeTab === tab
//                     ? 'border-b-2 border-blue-500 text-blue-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 {tab === 'myProperties' ? 'My Listings' : tab === 'allProperties' ? 'All Properties' : 'Add New Property'}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       ) : error ? (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
//       ) : activeTab === 'myProperties' ? (
//         <>
//           {myProperties.length === 0 ? (
//             <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//               You haven't listed any properties yet.
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {myProperties.map((property) => (
//                   <PropertyCard
//                     key={property._id}
//                     title={property.title}
//                     price={typeof property.price === 'string' ? parseFloat(property.price) : property.price}
//                     location={`${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
//                     property={property}
//                     onViewDetails={handleViewDetails}
//                   />
//                 ))}
//               </div>
//               {/* Pagination */}
//               <div className="mt-6 flex justify-center gap-2">
//                 <button
//                   onClick={() => setPage((prev) => Math.max(1, prev - 1))}
//                   disabled={page === 1}
//                   className="px-4 py-2 border rounded disabled:opacity-50"
//                 >
//                   Previous
//                 </button>
//                 <span className="px-4 py-2">
//                   Page {page} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
//                   disabled={page === totalPages}
//                   className="px-4 py-2 border rounded disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}
//         </>
//       ) : activeTab === 'allProperties' ? (
//         <>
//           {allProperties.length === 0 ? (
//             <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//               No properties are currently listed.
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {allProperties.map((property) => (
//                   <PropertyCard
//                     key={property._id}
//                     title={property.title}
//                     price={typeof property.price === 'string' ? parseFloat(property.price) : property.price}
//                     location={`${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
//                     property={property}
//                     onViewDetails={handleViewDetails}
//                   />
//                 ))}
//               </div>
//               {/* Pagination */}
//               <div className="mt-6 flex justify-center gap-2">
//                 <button
//                   onClick={() => setPage((prev) => Math.max(1, prev - 1))}
//                   disabled={page === 1}
//                   className="px-4 py-2 border rounded disabled:opacity-50"
//                 >
//                   Previous
//                 </button>
//                 <span className="px-4 py-2">
//                   Page {page} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
//                   disabled={page === totalPages}
//                   className="px-4 py-2 border rounded disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           )}
//         </>
//       ) : (
//         <PropertyForm userLocation={null} />
//       )}

//       {selectedProperty && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
//                 <button onClick={handleCloseDetails} className="text-gray-500 hover:text-gray-700">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-6 w-6"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <PropertyCard
//                 title={selectedProperty.title}
//                 price={typeof selectedProperty.price === 'string' ? parseFloat(selectedProperty.price) : selectedProperty.price}
//                 location={`${selectedProperty.location.address}, ${selectedProperty.location.city}, ${selectedProperty.location.state}, ${selectedProperty.location.country}`}
//                 property={selectedProperty}
//                 showDetailedView={true}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// };

// export default AgentDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout'; // Ensure this path is correct
import PropertyCard from '@/components/PropertyCard';
import PropertyForm from '@/components/PropertyForm';
import axiosInstance from '@/services/axiosInstance';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Property } from '../types';
import { useAgentStore } from '@/store/agentStore';

// Analytics placeholder
const trackEvent = (event: string, data: Record<string, any>) => {
  console.log(`Analytics: ${event}`, data);
};

const AgentDashboard: React.FC = () => {
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'myProperties' | 'allProperties' | 'add'>('myProperties');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { agents } = useAgentStore();
  const { isAuthenticated, accessToken, user, refreshToken } = useAuthStore();

  const showToast = useCallback(
    ({ title, description, variant = 'default' }: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
      toast({
        title,
        description,
        variant,
        duration: 3000,
      });
    },
    [toast]
  );

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
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      await Promise.all([fetchMyProperties(), fetchAllProperties()]);
      setLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, navigate, page, filterStatus, sortBy, sortOrder, searchQuery]);

  // Fetch my properties
  const fetchMyProperties = useCallback(async () => {
    try {
      setLoading(true);
      if (!accessToken || !user?._id) {
        throw new Error('Authentication token or user ID missing');
      }

      const params = {
        page,
        limit: 9,
        status: filterStatus === 'all' ? undefined : filterStatus,
        sortBy,
        sortOrder,
        search: searchQuery || undefined,
      };

      const response = await axiosInstance.get(`/Property/properties/seller/${user._id}`, { params });
      const { data, totalPages: total } = response.data;
      setMyProperties(data || []);
      setTotalPages(total || 1);
      trackEvent('Fetch My Properties Success', { agentId: user._id, page, count: data?.length || 0 });
    } catch (err: any) {
      handleError(err, 'Failed to fetch my properties');
    } finally {
      setLoading(false);
    }
  }, [accessToken, user?._id, page, filterStatus, sortBy, sortOrder, searchQuery]);

  // Fetch all properties
  const fetchAllProperties = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        status: filterStatus === 'all' ? undefined : filterStatus,
        sortBy,
        sortOrder,
        search: searchQuery || undefined,
      };

      const response = await axiosInstance.get(`/Property/properties/seller/${user._id}`, { params });
      const { data, totalPages: total } = response.data;
      setAllProperties(data || []);
      setTotalPages(total || 1);
      trackEvent('Fetch All Properties Success', { page, count: data?.length || 0 });
    } catch (err: any) {
      handleError(err, 'Failed to fetch all properties');
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, sortBy, sortOrder, searchQuery]);

  // Handle errors
  const handleError = async (err: any, defaultMessage: string) => {
    console.error('❌ API call failed:', err);
    if (err.response?.status === 401) {
      try {
        await useAuthStore.getState().refreshToken;
        await Promise.all([fetchMyProperties(), fetchAllProperties()]);
      } catch (refreshErr) {
        setError('Session expired. Please log in again.');
        navigate('/login');
        showToast({ variant: 'destructive', title: 'Authentication Error', description: 'Session expired.' });
      }
    } else if (err.response?.status === 404) {
      setError('No properties found. Please check if the endpoint or agent ID is correct.');
      showToast({ variant: 'destructive', title: 'Not Found', description: 'No properties found for this request.' });
    } else {
      const message = err.message || defaultMessage;
      setError(message);
      showToast({ variant: 'destructive', title: 'Error', description: message });
    }
    trackEvent('Fetch Properties Error', { error: err.message });
  };

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseDetails = () => {
    setSelectedProperty(null);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
        <p className="text-gray-600">Manage properties and connect buyers with sellers</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'sold')}
          className="border rounded px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'price' | 'date')}
          className="border rounded px-4 py-2"
        >
          <option value="price">Price</option>
          <option value="date">Date</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="border rounded px-4 py-2"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {['myProperties', 'allProperties', 'add'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'myProperties' | 'allProperties' | 'add')}
                className={`py-4 px-6 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'myProperties' ? 'My Listings' : tab === 'allProperties' ? 'All Properties' : 'Add New Property'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      ) : activeTab === 'myProperties' ? (
        <>
          {myProperties.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              You haven't listed any properties yet.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    title={property.title}
                    price={typeof property.price === 'string' ? parseFloat(property.price) : property.price}
                    location={`${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
                    property={property}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
              {/* Pagination */}
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      ) : activeTab === 'allProperties' ? (
        <>
          {allProperties.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No properties are currently listed.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    title={property.title}
                    price={typeof property.price === 'string' ? parseFloat(property.price) : property.price}
                    location={`${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
                    property={property}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
              {/* Pagination */}
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <PropertyForm userLocation={userLocation} />
      )}

      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
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
              <PropertyCard
                title={selectedProperty.title}
                price={typeof selectedProperty.price === 'string' ? parseFloat(selectedProperty.price) : selectedProperty.price}
                location={`${selectedProperty.location.address}, ${selectedProperty.location.city}, ${selectedProperty.location.state}, ${selectedProperty.location.country}`}
                property={selectedProperty}
                showDetailedView={true}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AgentDashboard;