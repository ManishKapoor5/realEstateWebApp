// // src/pages/PropertyList.tsx
// import React, { useState, useEffect } from 'react';
// // import { getNearbyProperties } from '@/services/api';
// import PropertyCard from '../components/PropertyCard';
// import { Property } from '../types'; // Import global Property type
// import {useLocation} from 'react-router-dom';

// interface Location {
//   latitude: number;
//   longitude: number;
// }

// interface ApiResponse {
//   success: boolean;
//   data: Property[];
//   message?: string;
// }

// const PropertyList: React.FC = () => {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [location, setLocation] = useState<Location>({
//     latitude: 28.6139,
//     longitude: 77.2090
//   });

//   const filteredData = useLocation();

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position: GeolocationPosition) => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude
//         });
//       },
//       (error: GeolocationPositionError) => {
//         console.error('Error getting location:', error);
//       }
//     );
//   }, []);

//   useEffect(() => {
//     const fetchProperties = async (): Promise<void> => {
//       setLoading(true);
//       try {
//         // const result: ApiResponse = await getNearbyProperties(location.latitude, location.longitude);
//         // if (result.success) {
//         //   setProperties(result.data);
//         // } else {
//         //   setError(result.message || 'Failed to fetch properties');
//         // }
//       } catch (err) {
//         setError('An error occurred. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, [location]);

//   return (
//     <div className="property-list-page">
//       <h1>Available Properties</h1>
      
//       {error && <div className="error-message">{error}</div>}
      
//       {loading ? (
//         <div className="loading">Loading properties...</div>
//       ) : filteredData.state.length > 0 ? (
//         <div className="property-grid">
//           {filteredData.state.map((property) => (
//             <PropertyCard key={property._id} property={property} />
//           ))}
//         </div>
//       ) : (
//         <p>No properties found in your area.</p>
//       )}
//     </div>
//   );
// };

// export default PropertyList;

// src/pages/PropertyList.tsx
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import PropertyCard from '../components/PropertyCard';
// import { Property } from '../types';

// interface Location {
//   latitude: number;
//   longitude: number;
// }

// const PropertyList: React.FC = () => {
//   const [location, setLocation] = useState<Location>({
//     latitude: 28.6139,
//     longitude: 77.2090, // Default: Delhi
//   });
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');

//   const locationState = useLocation();
//   const filteredProperties: Property[] = locationState.state || [];

//   // Get user location
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position: GeolocationPosition) => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       },
//       (err: GeolocationPositionError) => {
//         console.error('Error getting location:', err);
//         setError('Unable to fetch your location.');
//       }
//     );
//   }, []);

//   // Simulated fetch (optional — based on your real API logic)
//   useEffect(() => {
//     // You might use this for "nearby" logic later
//     setLoading(false);
//   }, [location]);

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
//         Available Properties
//       </h1>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center text-lg text-gray-600">Loading properties...</div>
//       ) : filteredProperties.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProperties.map((property) => (
//             <PropertyCard key={property._id} property={property} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center text-gray-500 text-lg mt-10">
//           No properties found in your area.
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyList;

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import PropertyCard from '../components/PropertyCard';
// import { Property } from '../types';
// import { MapPin, Grid, List, ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";

// interface Location {
//   latitude: number;
//   longitude: number;
// }

// interface ApiResponse {
//   success: boolean;
//   data: Property[];
//   message?: string;
// }

// export interface PropertyCardProps {
//   property: Property;
//   viewMode?: 'grid' | 'list'; // Add viewMode as an optional prop
// }

// // Mock data for display


// const PropertyList: React.FC = () => {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [location, setLocation] = useState<Location>({
//     latitude: 28.6139,
//     longitude: 77.2090
//   });

//   const { toast } = useToast();
//   const navigate = useNavigate();
//   // We'll use state from location if available, otherwise use our mock data
//   const locationState = useLocation().state as Property[] | undefined;

//   useEffect(() => {
//     // Simulate loading
//     const timer = setTimeout(() => {
//       setLoading(false);
//       if (locationState && locationState.length > 0) {
//         setProperties(locationState);
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [locationState]);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position: GeolocationPosition) => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude
//         });
//         toast({
//           title: "Location Updated",
//           description: "Showing properties near your current location",
//         });
//       },
//       (error: GeolocationPositionError) => {
//         console.error('Error getting location:', error);
//         toast({
//           variant: "destructive",
//           title: "Location Error",
//           description: "Unable to get your location. Showing default properties.",
//         });
//       }
//     );
//   }, [toast]);

//   interface RefreshResultEvent extends React.MouseEvent<HTMLButtonElement> {}

//   const refreshResult = (e: RefreshResultEvent): void => {
//       e.preventDefault();

//       window.location.reload
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col gap-6">
//           {/* Header Section */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-lg p-6 shadow-sm">
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => navigate('/')}
//                   className="mr-2"
//                 >
//                   <ArrowLeft className="h-5 w-5" />
//                 </Button>
//                 <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
//               </div>
//               <div className="flex items-center gap-2 text-gray-600">
//                 <MapPin className="h-4 w-4" />
//                 <span className="text-sm">Near {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
//               </div>
//             </div>
            
//             {/* View Toggle Buttons */}
//             <div className="flex gap-2">
//               <Button
//                 variant={viewMode === 'grid' ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode('grid')}
//               >
//                 <Grid className="h-4 w-4 mr-2" />
//                 Grid
//               </Button>
//               <Button
//                 variant={viewMode === 'list' ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setViewMode('list')}
//               >
//                 <List className="h-4 w-4 mr-2" />
//                 List
//               </Button>
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               {error}
//             </div>
//           )}

//           {/* Loading State */}
//           {loading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="animate-pulse space-y-4">
//                 <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
//                 <div className="text-gray-500 text-center">Loading properties...</div>
//               </div>
//             </div>
//           ) : properties.length > 0 ? (
//             <div className={`grid gap-6 ${
//               viewMode === 'grid' 
//                 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
//                 : 'grid-cols-1'
//             } animate-fade-in`}>
//               {properties.map((property) => (
//                 <PropertyCard 
//                   key={property._id} 
//                   property={property}
//                   viewMode={viewMode}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//               <div className="text-gray-500">No properties found in your area.</div>
//               <Button 
//                 variant="outline" 
//                 className="mt-4"
//                 onClick={refreshResult}
//               >
//                 Refresh Results
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyList;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';
import { Grid, List, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const navigate = useNavigate();
  const locationState = useLocation().state as Property[] | undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (locationState && locationState.length > 0) {
        setProperties(locationState);
      } else {
        setProperties([]); // No properties passed
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [locationState]);

  const refreshResult = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.reload(); // <-- fixed (added parentheses)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="mr-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
              </div>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse space-y-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
                <div className="text-gray-500 text-center">Loading properties...</div>
              </div>
            </div>
          ) : properties.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              } animate-fade-in`}
            >
              {properties.map((property) => (
                <PropertyCard 
                  key={property._id} 
                  property={property}
                  viewMode={viewMode}
                  title={property.title}
                  price={typeof property.price === 'string' ? parseFloat(property.price) : property.price}
                  location={`${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-500">No properties found.</div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={refreshResult}
              >
                Refresh Results
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;