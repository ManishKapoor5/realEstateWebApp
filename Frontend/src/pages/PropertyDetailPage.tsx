// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import { MapPin, Home, Calendar, User, Phone, Mail, Bed, Bath, Square as SquareFoot, Check, X, AlertCircle } from 'lucide-react';
// import { Property, TierLimit, UserTier } from '../types';
// import { useAuthStore } from '../store/authStore';
// import { useLimitConfigStore } from '../store/limitConfigStore';
// import ViewLimitReached from '@/components/limits/ViewLimitReached';

// const PropertyDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuthStore();
//   const { limitConfig, fetchLimitConfig } = useLimitConfigStore();
  
//   const [showUpgradeModal, setShowUpgradeModal] = useState(false);
//   const [viewRecorded, setViewRecorded] = useState(false);

//   // Fetch property data
//   const { data: property, isLoading, error } = useQuery<Property, Error>(
//     ['property', id],
//     async () => {
//       if (!id) throw new Error("Property ID is required");
//       const response = await axios.get(`/api/v1/property/getbyid/${id}`);
//       return response.data;
//     },
//     {
//       enabled: !!id,
//       retry: 1,
//       onSuccess: () => {
//         // On successful property fetch, check and record view if authenticated
//         if (isAuthenticated && user && !viewRecorded) {
//           checkAndRecordView();
//         }
//       }
//     }
//   );
  
//   // Fetch limit config on mount
//   useEffect(() => {
//     fetchLimitConfig();
//   }, [fetchLimitConfig]);
  
//   // Function to check if user can view the property and record the view
//   const checkAndRecordView = async () => {
//     try {
//       if (!user || viewRecorded || !id) return;
      
//       const response = await axios.post('/api/property-views/check', {
//         propertyId: id
//       });
      
//       const { canView } = response.data;
      
//       if (!canView) {
//         setShowUpgradeModal(true);
//       } else {
//         // Record the view if the user can view the property
//         await axios.post('/api/property-views', {
//           propertyId: id
//         });
//         setViewRecorded(true);
//       }
//     } catch (error) {
//       console.error('Error checking view limits:', error);
//       // If there's an error, we'll still show the property
//       setViewRecorded(true);
//     }
//   };
  
 

//   const handleUpgradeTier = (tierId: string) => {
//    navigate(`UpgradeTier?tierId=${tierId}`);
//   };
  
//   // Handle join waitlist
//   const handleJoinWaitlist = async () => {
//     try {
//       if (!id) {
//         throw new Error("Property ID is required");
//       }
      
//       await axios.post('/api/waitlist', {
//         propertyId: id
//       });
      
//       // Show success message and close modal
//       alert('You have been added to the waitlist for this property!');
//       setShowUpgradeModal(false);
//     } catch (error) {
//       console.error('Error joining waitlist:', error);
//       alert('Failed to join waitlist. Please try again.');
//     }
//   };
  
//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <div className="flex justify-center">
//           <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
//         </div>
//       </div>
//     );
//   }
  
//   if (error || !property) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <div className="max-w-3xl mx-auto bg-red-50 p-6 rounded-lg border border-red-200">
//           <div className="flex items-center">
//             <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
//             <h2 className="text-xl font-semibold text-red-800">Property Not Found</h2>
//           </div>
//           <p className="mt-2 text-red-600">
//             The property you're looking for doesn't exist or has been removed.
//           </p>
//           <button
//             onClick={() => navigate('/properties')}
//             className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//           >
//             Back to Properties
//           </button>
//         </div>
//       </div>
//     );
//   }
  
//   // If the upgrade modal should be shown, render it instead of the property details
//   if (showUpgradeModal && limitConfig) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <ViewLimitReached
//           allowWaitlist={limitConfig.allowWaitlist}
//           tiers={limitConfig.tiers.map(tier => ({ ...tier, id: tier.id as UserTier }))}
//           onUpgradeTier={handleUpgradeTier}
//           onJoinWaitlist={handleJoinWaitlist}
//         />
//       </div>
//     );
//   }
  
//   const formatPrice = (price: number) => {
//     if (isNaN(price)) return "Price not available";
    
//     if (price >= 10000000) {
//       return `₹${(price / 10000000).toFixed(2)} Cr`;
//     } else if (price >= 100000) {
//       return `₹${(price / 100000).toFixed(2)} Lac`;
//     } else {
//       return `₹${price.toLocaleString()}`;
//     }
//   };
  
//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-start mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//               {property.title}
//             </h1>
//             <p className="text-gray-600 flex items-center">
//               <MapPin className="h-5 w-5 mr-1" />
//               {property.location?.address || 'Address not available'}, 
//               {property.location?.city || ''}, 
//               {property.location?.state || ''}
//             </p>
//           </div>
//           <div className="mt-4 md:mt-0">
//             <span className="text-2xl md:text-3xl font-bold text-blue-600">
//               {formatPrice(Number(property.price))}
//             </span>
//           </div>
//         </div>
        
//         {/* Property Images */}
//         <div className="mb-10">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="rounded-lg overflow-hidden h-80">
//               <img 
//                 src={property.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image'} 
//                 alt={property.title}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               {[1, 2, 3, 4].map((index) => (
//                 <div key={index} className="rounded-lg overflow-hidden h-40">
//                   <img 
//                     src={property.images?.[index] || 'https://via.placeholder.com/400x300?text=No+Image'} 
//                     alt={`${property.title} ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
        
//         {/* Property Details */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="md:col-span-2">
//             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
//                 <div className="flex flex-col items-center">
//                   <Home className="h-6 w-6 text-blue-600 mb-1" />
//                   <span className="text-sm text-gray-500">Type</span>
//                   <span className="font-medium text-gray-800 capitalize">{property.type || 'N/A'}</span>
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <Bed className="h-6 w-6 text-blue-600 mb-1" />
//                   <span className="text-sm text-gray-500">Bedrooms</span>
//                   <span className="font-medium text-gray-800">{property.features?.bedrooms || 'N/A'}</span>
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <Bath className="h-6 w-6 text-blue-600 mb-1" />
//                   <span className="text-sm text-gray-500">Bathrooms</span>
//                   <span className="font-medium text-gray-800">{property.features?.bathrooms || 'N/A'}</span>
//                 </div>
//                 <div className="flex flex-col items-center">
//                   <SquareFoot className="h-6 w-6 text-blue-600 mb-1" />
//                   <span className="text-sm text-gray-500">Area</span>
//                   <span className="font-medium text-gray-800">{property.features?.area || 'N/A'} sq.ft</span>
//                 </div>
//               </div>
              
//               <hr className="my-6" />
              
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
//               <p className="text-gray-700 whitespace-pre-line">{property.description || 'No description available'}</p>
              
//               <hr className="my-6" />
              
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
//                 <div className="flex items-center">
//                   {property.features?.parking ? (
//                     <Check className="h-5 w-5 text-green-500 mr-2" />
//                   ) : (
//                     <X className="h-5 w-5 text-red-500 mr-2" />
//                   )}
//                   <span className="text-gray-700">Parking</span>
//                 </div>
//                 <div className="flex items-center">
//                   {property.features?.furnished ? (
//                     <Check className="h-5 w-5 text-green-500 mr-2" />
//                   ) : (
//                     <X className="h-5 w-5 text-red-500 mr-2" />
//                   )}
//                   <span className="text-gray-700">Furnished</span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="md:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Owner</h2>
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <User className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
//                   <div>
//                     <span className="text-sm text-gray-500">Name</span>
//                     <p className="text-gray-800 font-medium">{property.owner?.name || 'N/A'}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <Phone className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
//                   <div>
//                     <span className="text-sm text-gray-500">Phone</span>
//                     <p className="text-gray-800 font-medium">{property.owner?.contact || 'N/A'}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <Mail className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
//                   <div>
//                     <span className="text-sm text-gray-500">Email</span>
//                     <p className="text-gray-800 font-medium">{property.owner?.email || 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-6">
//                 <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
//                   Send Message
//                 </button>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Info</h2>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Status</span>
//                   <span className="font-medium text-gray-800 capitalize">{property.status || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Approval</span>
//                   <span className="font-medium text-gray-800 capitalize">{property.approval || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Listed On</span>
//                   <span className="font-medium text-gray-800">
//                     {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyDetailPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  MapPin, 
  Home, 
  User, 
  Phone, 
  Mail, 
  Bed, 
  Bath, 
  Square as SquareFoot, 
  Check, 
  X, 
  AlertCircle,
  MapIcon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLimitConfigStore } from '../store/limitConfigStore';
import ViewLimitReached from '@/components/limits/ViewLimitReached';

// Updated to match the mongoose schema
interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

interface PropertyGeo {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: boolean;
  furnished: boolean;
}

interface PropertyOwner {
  name: string;
  contact: string;
  email: string;
}

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: 'apartment' | 'house' | 'commercial' | 'land';
  location: PropertyLocation;
  geo: PropertyGeo;
  features: PropertyFeatures;
  images: string[];
  owner: PropertyOwner;
  sellerId: string;
  approval: string;
  status: 'available' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  property: Property;
}

interface UserTier {
  id: string;
  name: string;
  price: number;
  features: string[];
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { limitConfig, fetchLimitConfig } = useLimitConfigStore();
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [viewRecorded, setViewRecorded] = useState(false);

  // Fetch property data
  const { data, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) throw new Error("Property ID is required");
      const response = await axios.get<ApiResponse>(`https://realestatesite-backend.onrender.com/api/v1/Property/getby/${id}`);
      return response.data;
    },
    enabled: !!id,
    retry: 1,
  });

  // Property data is available after successful fetch
  const property = data?.property;
  
  // Fetch limit config on mount
  useEffect(() => {
    fetchLimitConfig();
  }, [fetchLimitConfig]);
  
  // Check view limits when property data is loaded and user is authenticated
  useEffect(() => {
    if (property && isAuthenticated && user && !viewRecorded) {
      checkAndRecordView();
    }
  }, [property, isAuthenticated, user, viewRecorded]);
  
  // Function to check if user can view the property and record the view
  const checkAndRecordView = async () => {
    try {
      if (!user || viewRecorded || !id) return;
      
      const response = await axios.post('/api/property-views/check', {
        propertyId: id
      });
      
      const { canView } = response.data;
      
      if (!canView) {
        setShowUpgradeModal(true);
      } else {
        // Record the view if the user can view the property
        await axios.post('/api/property-views', {
          propertyId: id
        });
        setViewRecorded(true);
      }
    } catch (error) {
      console.error('Error checking view limits:', error);
      // If there's an error, we'll still show the property
      setViewRecorded(true);
    }
  };
  
  const handleUpgradeTier = (tierId: string) => {
    navigate(`/upgradeTier?tierId=${tierId}`);
  };
  
  // Handle join waitlist
  const handleJoinWaitlist = async () => {
    try {
      if (!id) {
        throw new Error("Property ID is required");
      }
      
      await axios.post('/api/waitlist', {
        propertyId: id
      });
      
      // Show success message and close modal
      alert('You have been added to the waitlist for this property!');
      setShowUpgradeModal(false);
    } catch (error) {
      console.error('Error joining waitlist:', error);
      alert('Failed to join waitlist. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-red-800">Property Not Found</h2>
          </div>
          <p className="mt-2 text-red-600">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/properties')}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }
  
  // If the upgrade modal should be shown, render it instead of the property details
  if (showUpgradeModal && limitConfig) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ViewLimitReached
          allowWaitlist={limitConfig.allowWaitlist}
          tiers={limitConfig.tiers.map(tier => ({ ...tier, id: tier.id }))}
          onUpgradeTier={handleUpgradeTier}
          onJoinWaitlist={handleJoinWaitlist}
        />
      </div>
    );
  }
  
  const formatPrice = (price: number) => {
    if (isNaN(price)) return "Price not available";
    
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  // Get property type in capitalized form
  const getPropertyType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Get status with appropriate styling
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      sold: 'bg-red-100 text-red-800',
      rented: 'bg-blue-100 text-blue-800'
    };
    
    const color = statusColors[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {property.title}
            </h1>
            <p className="text-gray-600 flex items-center">
              <MapPin className="h-5 w-5 mr-1" />
              {property.location.address}, 
              {property.location.city}, 
              {property.location.state}, 
              {property.location.country} - {property.location.postalCode}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <span className="text-2xl md:text-3xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </span>
            <div className="mt-2">
              {getStatusBadge(property.status)}
            </div>
          </div>
        </div>
        
        {/* Property Images */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden h-80">
              <img 
                src={property.images[0] || '/api/placeholder/800/600'} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="rounded-lg overflow-hidden h-40">
                  <img 
                    src={property.images[index] || '/api/placeholder/400/300'} 
                    alt={`${property.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
                <div className="flex flex-col items-center">
                  <Home className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="font-medium text-gray-800 capitalize">{getPropertyType(property.type)}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bed className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-sm text-gray-500">Bedrooms</span>
                  <span className="font-medium text-gray-800">{property.features.bedrooms}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bath className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-sm text-gray-500">Bathrooms</span>
                  <span className="font-medium text-gray-800">{property.features.bathrooms}</span>
                </div>
                <div className="flex flex-col items-center">
                  <SquareFoot className="h-6 w-6 text-blue-600 mb-1" />
                  <span className="text-sm text-gray-500">Area</span>
                  <span className="font-medium text-gray-800">{property.features.area} sq.ft</span>
                </div>
              </div>
              
              <hr className="my-6" />
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              
              <hr className="my-6" />
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                <div className="flex items-center">
                  {property.features.parking ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-700">Parking</span>
                </div>
                <div className="flex items-center">
                  {property.features.furnished ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-700">Furnished</span>
                </div>
              </div>
              
              <hr className="my-6" />
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="h-64 bg-gray-200 rounded-lg mb-4">
                {/* Map would go here - using placeholder for now */}
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <MapIcon size={48} className="text-gray-400" />
                  <span className="ml-2 text-gray-500">Map view at {property.location.latitude}, {property.location.longitude}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-700">{property.location.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">City</p>
                  <p className="text-gray-700">{property.location.city}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">State</p>
                  <p className="text-gray-700">{property.location.state}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Country</p>
                  <p className="text-gray-700">{property.location.country}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Postal Code</p>
                  <p className="text-gray-700">{property.location.postalCode}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Owner</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500">Name</span>
                    <p className="text-gray-800 font-medium">{property.owner.name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500">Phone</span>
                    <p className="text-gray-800 font-medium">{property.owner.contact}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <p className="text-gray-800 font-medium">{property.owner.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </div>
            </div> */}
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Info</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-gray-800 capitalize">{property.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Approval</span>
                  <span className="font-medium text-gray-800 capitalize">{property.approval}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Listed On</span>
                  <span className="font-medium text-gray-800">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium text-gray-800">
                    {new Date(property.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Property ID</span>
                  <span className="font-medium text-gray-800">
                    {property._id.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;