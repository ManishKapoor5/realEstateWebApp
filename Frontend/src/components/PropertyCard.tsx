
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// // import { Heart, MapPin } from "lucide-react";
// // import { useState } from "react";

// // export interface PropertyProps {
// //   id: number;
// //   title: string;
// //   location: string;
// //   price: string;
// //   pricePerSqFt?: string;
// //   size: string;
// //   bedrooms: number;
// //   bathrooms: number;
// //   image: string;
// //   propertyType: string;
// //   isNew?: boolean;
// //   isVerified?: boolean;
// // }

// // const PropertyCard = ({ property }: { property: PropertyProps }) => {
// //   const [liked, setLiked] = useState(false);
  
// //   return (
// //     <Card className="overflow-hidden hover:shadow-md transition-shadow">
// //       <div className="relative">
// //         <img 
// //           src={property.image} 
// //           alt={property.title}
// //           className="h-48 w-full object-cover"
// //         />
// //         <Button 
// //           variant="ghost" 
// //           size="icon"
// //           className={`absolute top-2 right-2 bg-white/90 hover:bg-white ${liked ? 'text-red-500' : 'text-gray-500'}`}
// //           onClick={() => setLiked(!liked)}
// //         >
// //           <Heart className={liked ? 'fill-current' : ''} size={18} />
// //         </Button>
        
// //         {property.isNew && (
// //           <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">New</Badge>
// //         )}
        
// //         {property.isVerified && (
// //           <Badge className="absolute bottom-2 left-2 bg-blue-500 hover:bg-blue-600">Verified</Badge>
// //         )}
// //       </div>
      
// //       <CardHeader className="py-3 px-4">
// //         <div className="flex justify-between">
// //           <div>
// //             <p className="text-lg font-semibold text-gray-900">{property.price}</p>
// //             {property.pricePerSqFt && (
// //               <p className="text-xs text-gray-500">₹{property.pricePerSqFt}/sq.ft</p>
// //             )}
// //           </div>
// //           <div className="text-right">
// //             <p className="text-sm font-medium">{property.size}</p>
// //             <p className="text-xs text-gray-500">{property.propertyType}</p>
// //           </div>
// //         </div>
// //       </CardHeader>
      
// //       <CardContent className="px-4 py-2">
// //         <h3 className="text-base font-medium mb-1 line-clamp-1">{property.title}</h3>
// //         <p className="text-sm text-gray-500 flex items-center mb-3">
// //           <MapPin size={14} className="mr-1 text-gray-400" />
// //           <span className="line-clamp-1">{property.location}</span>
// //         </p>
        
// //         <div className="flex mt-2">
// //           <div className="flex items-center mr-4">
// //             <span className="text-sm font-medium">{property.bedrooms}</span>
// //             <span className="text-xs text-gray-500 ml-1">Beds</span>
// //           </div>
// //           <div className="flex items-center">
// //             <span className="text-sm font-medium">{property.bathrooms}</span>
// //             <span className="text-xs text-gray-500 ml-1">Baths</span>
// //           </div>
// //         </div>
// //       </CardContent>
      
// //       <CardFooter className="flex justify-between px-4 py-3 border-t">
// //         <Button variant="outline" size="sm" className="text-xs">
// //           Contact Owner
// //         </Button>
// //         <Button variant="outline" size="sm" className="text-xs">
// //           View Details
// //         </Button>
// //       </CardFooter>
// //     </Card>
// //   );
// // };

// // export default PropertyCard;

// // src/components/PropertyCard.tsx
// // import React, { useState } from 'react';
// // import { Property } from '../types';
// // import { Card, CardContent, CardFooter } from './ui/card';
// // import { Button } from './ui/button';

// // interface PropertyCardProps {
// //   property: Property;
// //   showDetailedView?: boolean;
// //   onViewDetails?: (property: Property) => void;
// //   onDelete?: (id: string) => void;
// // }

// // const PropertyCard: React.FC<PropertyCardProps> = ({ property, showDetailedView = false, onViewDetails, onDelete }) => {
// //   const [imageError, setImageError] = useState(false);
  
// //   // Handle image loading errors
// //   const handleImageError = () => {
// //     setImageError(true);
// //   };

// //   return (
// //     <Card className="overflow-hidden hover:shadow-md transition-shadow">
// //       <div className="relative h-48">
// //         <img
// //           src={imageError || !property.images ? "https://placehold.co/600x400" : property.images}
// //           alt={property.title}
// //           className="w-full h-48 object-cover"
// //         />
// //         <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 m-2 rounded">
// //           {property.status || 'Available'}
// //         </div>
// //       </div>
// //       <CardContent className="px-4 py-2">
// //         <h3 className="text-base font-medium mb-1 line-clamp-1">{property.title}</h3>
// //         <p className="text-gray-600 mb-2">{property.location.address} {property.location.city}</p>
// //         <p className="text-blue-600 font-bold text-xl mb-3">{property.price.toLocaleString()}</p>
        
// //         <div className="flex justify-between mb-3">
// //           <div className="text-sm">
// //             <span className="text-sm font-medium">{property.bedrooms}</span> 
// //             <span className="text-xs text-gray-500 ml-1">Bedrooms</span>
// //           </div>
// //           <div className="text-sm">
// //             <span className="text-sm font-medium">{property.bathrooms}</span>
// //             <span className="text-xs text-gray-500 ml-1">Bathrooms</span>
// //           </div>
// //           {/* <div className="text-sm">
// //             <span className="font-bold">{property.area}</span> sq.ft
// //           </div> */}
// //         </div>
        
// //         {showDetailedView && (
// //           <div className="mt-4 border-t pt-4">
// //             <p className="text-gray-700 mb-4">{property.description}</p>
// //             <div className="mb-4">
// //               <h4 className="font-semibold mb-2">Features:</h4>
// //               <ul className="list-disc pl-5">
// //                 {property.features.parking && <li>Parking Available</li>}
// //                 {property.features.furnished && <li>Fully Furnished</li>}
// //               </ul>
// //             </div>
        
// //               <CardFooter className="flex justify-between px-4 py-3 border-t">
// //                <Button variant="outline" size="sm" className="text-xs">
// //                   Contact Owner
// //                   <p>{property.owner.name}</p>
// //                   <p>{property.owner.email}</p>
// //                   <p>{property.owner.contact}</p>
// //                 </Button>  
// //                 </CardFooter>
// //           </div>
// //         )}
        
// //         {!showDetailedView && onViewDetails && (
// //           <Button variant="outline" size="sm" className="text-xs"         
// //             onClick={() => onViewDetails(property)}
// //           >
// //             View Details
// //           </Button>
// //         )}

// //         {onDelete && (
// //           <button
// //             onClick={() => onDelete(property._id)}
// //             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
// //           >
// //             Delete
// //           </button>
// //         )}
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default PropertyCard;

// import React, { useState } from 'react';
// import { Property } from '../types';
// import { Card, CardContent, CardFooter } from './ui/card';
// import { Button } from './ui/button';
// import { Building2, BedDouble, Bath, MapPin, Phone, Mail, User } from 'lucide-react';

// interface PropertyCardProps {
//   property: Property;
//   showDetailedView?: boolean;
//   onViewDetails?: (property: Property) => void;
//   onDelete?: (id: string) => void;
//   viewMode?: 'grid' | 'list';
// }

// const PropertyCard: React.FC<PropertyCardProps> = ({ 
//   property, 
//   showDetailedView = false, 
//   onViewDetails, 
//   onDelete 
// }) => {
//   const [imageError, setImageError] = useState(false);
  
//   const handleImageError = () => {
//     setImageError(true);
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
//       <div className="relative h-56">
//         <img
//           src={imageError || !property.images ? "/api/placeholder/600/400" : property.images}
//           alt={property.title}
//           className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
//           onError={handleImageError}
//         />
//         <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-3 rounded-full text-sm font-medium shadow-md">
//           {property.status || 'Available'}
//         </div>
//       </div>
      
//       <CardContent className="px-5 py-4">
//         <h3 className="text-lg font-semibold mb-1 line-clamp-1 text-gray-800">{property.title}</h3>
        
//         <div className="flex items-center text-gray-500 mb-3">
//           <MapPin size={16} className="mr-1" />
//           <p className="text-sm">{property.location.address}, {property.location.city}</p>
//         </div>
        
//         <p className="text-blue-600 font-bold text-2xl mb-4">{formatPrice(Number(property.price))}</p>
        
//         <div className="flex justify-between mb-4 px-2 py-3 bg-gray-50 rounded-lg">
//           <div className="flex flex-col items-center">
//             <div className="flex items-center mb-1">
//               <BedDouble size={18} className="text-gray-600 mr-1" />
//               <span className="text-base font-medium">{property.bedrooms}</span> 
//             </div>
//             <span className="text-xs text-gray-500">Bedrooms</span>
//           </div>
          
//           <div className="flex flex-col items-center">
//             <div className="flex items-center mb-1">
//               <Bath size={18} className="text-gray-600 mr-1" />
//               <span className="text-base font-medium">{property.bathrooms}</span>
//             </div>
//             <span className="text-xs text-gray-500">Bathrooms</span>
//           </div>
          
//           {property.area && (
//             <div className="flex flex-col items-center">
//               <div className="flex items-center mb-1">
//                 <Building2 size={18} className="text-gray-600 mr-1" />
//                 <span className="text-base font-medium">{property.area}</span>
//               </div>
//               <span className="text-xs text-gray-500">sq.ft</span>
//             </div>
//           )}
//         </div>
        
//         {showDetailedView && (
//           <div className="mt-5 border-t pt-4">
//             <p className="text-gray-700 mb-5 leading-relaxed">{property.description}</p>
            
//             {property.features && Object.values(property.features).some(v => v) && (
//               <div className="mb-5">
//                 <h4 className="font-semibold mb-2 text-gray-800">Features:</h4>
//                 <ul className="grid grid-cols-2 gap-2">
//                   {property.features.parking && (
//                     <li className="flex items-center text-sm text-gray-600">
//                       <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//                       Parking Available
//                     </li>
//                   )}
//                   {property.features.furnished && (
//                     <li className="flex items-center text-sm text-gray-600">
//                       <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//                       Fully Furnished
//                     </li>
//                   )}
//                 </ul>
//               </div>
//             )}
            
//             <div className="bg-gray-50 p-4 rounded-lg mb-4">
//               <h4 className="font-semibold mb-3 flex items-center text-gray-800">
//                 <User size={16} className="mr-2" />
//                 Owner Information
//               </h4>
//               <div className="space-y-2">
//                 <p className="text-sm flex items-center">
//                   <User size={14} className="mr-2 text-gray-500" />
//                   <span className="text-gray-800">{property.owner.name}</span>
//                 </p>
//                 <p className="text-sm flex items-center">
//                   <Mail size={14} className="mr-2 text-gray-500" />
//                   <span className="text-gray-800">{property.owner.email}</span>
//                 </p>
//                 <p className="text-sm flex items-center">
//                   <Phone size={14} className="mr-2 text-gray-500" />
//                   <span className="text-gray-800">{property.owner.contact}</span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </CardContent>
      
//       <CardFooter className="px-5 py-4 flex justify-between border-t">
//         {!showDetailedView && onViewDetails && (
//           <Button 
//             onClick={() => onViewDetails(property)}
//             className="bg-blue-600 text-white hover:bg-blue-700 transition-colors w-full"
//           >
//             View Details
//           </Button>
//         )}
        
//         {showDetailedView && (
//           <Button 
//             variant="outline" 
//             className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full"
//           >
//             Contact Owner
//           </Button>
//         )}
        
//         {onDelete && (
//           <Button
//             onClick={() => onDelete(property._id)}
//             variant="destructive"
//             size="sm"
//             className="ml-2"
//           >
//             Delete
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;

// import React, { useState, useEffect } from 'react';
// import { Property } from '../types';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Building2, BedDouble, Bath, MapPin, Phone, Mail, User, Heart, Share2, Star } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { cn } from '@/lib/utils';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// interface PropertyCardProps {
//   property: Property;
//   showDetailedView?: boolean;
//   onViewDetails?: (property: Property) => void;
//   onDelete?: (id: string) => void;
//   viewMode?: 'grid' | 'list';
// }

// const PropertyCard: React.FC<PropertyCardProps> = ({
//   property,
//   showDetailedView = false,
//   onViewDetails,
//   onDelete,
//   viewMode = 'grid',
// }) => {
//   const [imageError, setImageError] = useState(false);
//   const [liked, setLiked] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCardLoading, setIsCardLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [showShareModal, setShowShareModal] = useState(false);

//   const images = Array.isArray(property.images) ? property.images : [property.images].filter(Boolean);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsCardLoading(false), 5000);
//     console.log("Feature property",property.title)
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (showDetailedView && images.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentImageIndex((prev) => (prev + 1) % images.length);
//       }, 4000);
//       return () => clearInterval(interval);
//     }
//   }, [images.length, showDetailedView]);

//   const handleImageError = () => {
//     setImageError(true);
//     setIsCardLoading(false);
//   };

//   const formatPrice = (price: number | string) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       maximumFractionDigits: 0,
//     }).format(Number(price));
//   };

//   const handleLike = () => {
//     setLiked(!liked);
//     console.log(`Property ${property._id} ${liked ? 'unliked' : 'liked'}`);
//   };

//   const handleShare = (platform?: string) => {
//     console.log(`Sharing property: ${property.title} on ${platform || 'clipboard'}`);
//     navigator.clipboard.writeText(window.location.href).then(() => {
//       setShowShareModal(false);
//       alert('Property link copied to clipboard!');
//     });
//   };

//   const handleDelete = async () => {
//     if (onDelete) {
//       setIsLoading(true);
//       try {
//         await onDelete(property._id);
//       } catch (err) {
//         console.error('Failed to delete property:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   if (isCardLoading) {
//     return (
//       <div className={cn(
//         'flex flex-col border border-gray-100 rounded-lg shadow-md bg-white',
//         viewMode === 'list' ? 'md:flex-row' : ''
//       )}>
//         <div className={cn('h-64 bg-gray-200 animate-pulse', viewMode === 'list' ? 'md:w-1/3' : 'w-full')} />
//         <div className={cn('p-6 space-y-4', viewMode === 'list' ? 'md:w-2/3' : 'w-full')}>
//           <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
//           <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
//           <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
//           <div className="grid grid-cols-3 gap-4">
//             <div className="h-4 bg-gray-200 rounded animate-pulse" />
//             <div className="h-4 bg-gray-200 rounded animate-pulse" />
//             <div className="h-4 bg-gray-200 rounded animate-pulse" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Card
//         className={cn(
//           'overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-xl',
//           viewMode === 'list' ? 'flex flex-col md:flex-row' : 'flex flex-col',
//           'animate-in fade-in-50 zoom-in-95'
//         )}
//       >
//         <div className={cn('relative', viewMode === 'list' ? 'md:w-1/3' : 'w-full', 'h-60')}>
//           <img
//             src={imageError || !images[currentImageIndex] ? '/api/placeholder/600/400' : images[currentImageIndex]}
//             alt={property.title}
//             className="w-full h-60 object-cover transition-transform duration-500 hover:scale-105"
//             onError={handleImageError}
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
//           <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
//             {property.status || 'Available'}
//           </Badge>
//           <Button
//             variant="ghost"
//             size="icon"
//             className={cn(
//               'absolute top-3 left-3 bg-white/90 hover:bg-white rounded-full shadow-sm transition-transform duration-200',
//               liked ? 'text-red-500 scale-110' : 'text-gray-600'
//             )}
//             onClick={handleLike}
//             aria-label={liked ? 'Unlike property' : 'Like property'}
//           >
//             <Heart className={cn('w-5 h-5', liked ? 'fill-current' : '')} />
//           </Button>
//           {property.isNew && (
//             <Badge className="absolute bottom-3 left-3 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
//               New
//             </Badge>
//           )}
//           {property.isVerified && (
//             <Badge className="absolute bottom-3 right-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
//               Verified
//             </Badge>
//           )}
//           {property.isFeatured && (
//             <Badge className="absolute top-12 left-3 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
//               <Star className="w-3 h-3 inline mr-1" />
//               Featured
//             </Badge>
//           )}
//           {showDetailedView && images.length > 1 && (
//             <div className="absolute inset-x-0 bottom-3 flex justify-between px-4">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="bg-white/90 hover:bg-white rounded-full shadow-sm"
//                 onClick={prevImage}
//                 aria-label="Previous image"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                 </svg>
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="bg-white/90 hover:bg-white rounded-full shadow-sm"
//                 onClick={nextImage}
//                 aria-label="Next image"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                 </svg>
//               </Button>
//             </div>
//           )}
//         </div>

//         <div className={cn(viewMode === 'list' ? 'md:w-2/3' : 'w-full')}>
//           <CardContent className="px-5 py-4">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger>
//                   <h3 className="text-lg font-semibold mb-1 line-clamp-1 text-gray-900">{property.title}</h3>
//                 </TooltipTrigger>
//                 <TooltipContent>{property.title}</TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//             <br />
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger>
//                   <div className="flex items-center text-gray-600 mb-3">
//                     <MapPin size={16} className="mr-2 text-blue-500" />
//                     <p className="text-sm line-clamp-1">
//                       {property.location.address}, {property.location.city}, {property.location.state}
//                     </p>
//                   </div>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   {property.location.address}, {property.location.city}, {property.location.state}
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//             <br />
//             <p className="text-blue-600 font-bold text-2xl mb-4">{formatPrice(property.price)}</p>

//             <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
//               <div className="flex flex-col items-center">
//                 <div className="flex items-center mb-1">
//                   <BedDouble size={18} className="text-blue-500 mr-1" />
//                   <span className="text-base font-medium">{property.features.bedrooms}</span>
//                 </div>
//                 <span className="text-xs text-gray-500">Bedrooms</span>
//               </div>
//               <div className="flex flex-col items-center">
//                 <div className="flex items-center mb-1">
//                   <Bath size={18} className="text-blue-500 mr-1" />
//                   <span className="text-base font-medium">{property.features.bathrooms}</span>
//                 </div>
//                 <span className="text-xs text-gray-500">Bathrooms</span>
//               </div>
//               {property.features.area && (
//                 <div className="flex flex-col items-center">
//                   <div className="flex items-center mb-1">
//                     <Building2 size= {18} className="text-blue-500 mr-1" />
//                     <span className="text-base font-medium">{property.features.area}</span>
//                   </div>
//                   <span className="text-xs text-gray-500">sq.ft</span>
//                 </div>
//               )}
//             </div>

//             {showDetailedView && (
//               <div className="mt-4 border-t pt-4">
//                 <p className="text-gray-700 mb-4 text-sm leading-relaxed">{property.description}</p>

//                 {property.features && Object.values(property.features).some(v => v) && (
//                   <div className="mb-4">
//                     <h4 className="font-semibold mb-2 text-base text-gray-800 flex items-center">
//                       <Star size={16} className="mr-2 text-yellow-500" />
//                       Features
//                     </h4>
//                     <ul className="grid grid-cols-2 gap-2">
//                       {property.features.parking && (
//                         <li className="flex items-center text-sm text-gray-600">
//                           <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//                           Parking Available
//                         </li>
//                       )}
//                       {property.features.furnished && (
//                         <li className="flex items-center text-sm text-gray-600">
//                           <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//                           Fully Furnished
//                         </li>
//                       )}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h4 className="font-semibold mb-3 text-base text-gray-800 flex items-center">
//                     <User size={16} className="mr-2 text-blue-500" />
//                     Owner Information
//                   </h4>
//                   <div className="space-y-2">
//                     <p className="text-sm flex items-center">
//                       <User size={14} className="mr-2 text-gray-500" />
//                       <span className="text-gray-800">{property.owner.name || 'N/A'}</span>
//                     </p>
//                     <p className="text-sm flex items-center">
//                       <Mail size={14} className="mr-2 text-gray-500" />
//                       <a
//                         href={`mailto:${property.owner.email}`}
//                         className="text-blue-600 hover:underline"
//                       >
//                         {property.owner.email || 'N/A'}
//                       </a>
//                     </p>
//                     <p className="text-sm flex items-center">
//                       <Phone size={14} className="mr-2 text-gray-500" />
//                       <a
//                         href={`tel:${property.owner.contact}`}
//                         className="text-blue-600 hover:underline"
//                       >
//                         {property.owner.contact || 'N/A'}
//                       </a>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </CardContent>

//           <CardFooter className="px-5 py-4 flex justify-between border-t bg-gray-50">
//             <div className="flex space-x-2">
//               {!showDetailedView && onViewDetails && (
//                 <Button
//                   onClick={() => onViewDetails(property)}
//                   className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 rounded-lg px-5 py-2 text-sm font-medium shadow-sm"
//                   disabled={isLoading}
//                 >
//                   View Details
//                 </Button>
//               )}
//               {showDetailedView && (
//                 <Button
//                   variant="outline"
//                   className="border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg px-5 py-2 text-sm font-medium shadow-sm"
//                   disabled={isLoading}
//                 >
//                   Contact Owner
//                 </Button>
//               )}
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setShowShareModal(true)}
//                 className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-all duration-200 rounded-lg shadow-sm"
//                 aria-label="Share property"
//               >
//                 <Share2 size={18} />
//               </Button>
//             </div>
//             {onDelete && (
//               <Button
//                 onClick={handleDelete}
//                 variant="destructive"
//                 size="sm"
//                 disabled={isLoading}
//                 className="bg-red-600 hover:bg-red-700 transition-all duration-200 rounded-lg text-sm font-medium shadow-sm"
//               >
//                 {isLoading ? 'Deleting...' : 'Delete'}
//               </Button>
//             )}
//           </CardFooter>
//         </div>
//       </Card>

//       <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Share Property</DialogTitle>
//           </DialogHeader>
//           <div className="flex flex-col space-y-4 py-4">
//             <p className="text-sm text-gray-600">Share this property via:</p>
//             <div className="flex space-x-4">
//               <Button
//                 variant="outline"
//                 className="flex-1"
//                 onClick={() => handleShare('twitter')}
//               >
//                 Twitter
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex-1"
//                 onClick={() => handleShare('facebook')}
//               >
//                 Facebook
//               </Button>
//               <Button
//                 variant="outline"
//                 className="flex-1"
//                 onClick={() => handleShare('linkedin')}
//               >
//                 LinkedIn
//               </Button>
//             </div>
//             <Button
//               onClick={() => handleShare()}
//               className="bg-blue-600 text-white hover:bg-blue-700"
//             >
//               Copy Link
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default PropertyCard;


// import { Heart } from "lucide-react";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";

// interface PropertyCardProps {
//   price: string;
//   title: string;
//   location: string;
//   postedBy: string;
//   postedDate: string;
//   imageUrl: string;
//   isVerified?: boolean;
// }

// const PropertyCard = ({
//   price,
//   title,
//   location,
//   postedBy,
//   postedDate,
//   imageUrl,
//   isVerified = false,
  
// }: PropertyCardProps) => {
//   return (
//     <Card className="overflow-hidden group relative">
//       <div className="relative">
//         <img
//           src={imageUrl}
//           alt={.title}
//           className="w-full h-48 object-cover"
//         />
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute top-2 right-2 hover:bg-white/20"
//         >
//           <Heart className="w-5 h-5 text-white hover:fill-white" />
//         </Button>
//         {isVerified && (
//           <Badge variant="secondary" className="absolute top-2 left-2 bg-green-600 text-white">
//             <span className="flex items-center gap-1">
//               ✓ Verified
//             </span>
//           </Badge>
//         )}
//         <div className="absolute bottom-2 left-2">
//           <Badge className="text-lg font-semibold bg-white text-black">
//             ₹ {price}
//           </Badge>
//         </div>
//       </div>
//       <div className="p-4">
//         <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
//         <p className="text-gray-600 text-sm mb-2">{location}</p>
//         <div className="flex justify-between items-center text-sm text-gray-500">
//           <span>Posted by {postedBy}</span>
//           <span>{postedDate}</span>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default PropertyCard;

// import { Property } from "@/types/property.ts";
// import React, { useEffect, useState } from "react";

//  interface PropertyCardProps {
//   property: Property;
//   showDetailedView?: boolean;
//   onViewDetails?: (property: Property) => void;
//   onDelete?: (id: string) => void;
//   viewMode?: 'grid' | 'list';
//   title: string;
//   price: number;
//   location: string;
// }

// const PropertyCard: React.FC<PropertyCardProps> = ({
//   property,
//   showDetailedView = false,
//   onViewDetails,
//   onDelete,
//   viewMode = 'grid',
// }) => {
// const [currentImageIndex, setCurrentImageIndex] = useState(0);
// const [imageError, setImageError] = useState(false);

// const images = Array.isArray(property.images) ? property.images : [property.images].filter(Boolean);

// useEffect(() => {
//     if (showDetailedView && images.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentImageIndex((prev) => (prev + 1) % images.length);
//       }, 4000);
//       return () => clearInterval(interval);
//     }
//   }, [images.length, showDetailedView]);

// //   // Handle image loading errors
//   const handleImageError = () => {
//     setImageError(true);
//   };

//   return (
//     <div className="border rounded-2xl shadow p-4 max-w-sm bg-white">
//       <img
//         src={imageError || !images[currentImageIndex] ? '/api/placeholder/600/400' : images[currentImageIndex]}
//         alt={property.title}
//         className="w-full h-48 object-cover rounded-xl"
//       />
//       <h3 className="text-xl font-semibold mt-2">{property.title}</h3>
//       <p className="text-gray-500">{property.location.address}</p>
//       <p className="text-green-600 font-bold text-lg mt-1">₹{property.price.toLocaleString()}</p>
//     </div>
//   );
// };

// export default PropertyCard;

import { Property } from "@/types/property.ts";
import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  title: string;
  price: number;
  location: string;
  showDetailedView?: boolean;
  onViewDetails?: (property: Property) => void;
  onDelete?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  showDetailedView = false,
  onViewDetails,
  onDelete,
  viewMode = 'grid',
}) => {

  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const images = Array.isArray(property.images) ? property.images : [property.images].filter(Boolean);

  useEffect(() => {
    if (showDetailedView && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images.length, showDetailedView]);

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(property);
    }
  };

  return (
    <div 
      className="border rounded-2xl shadow p-4 max-w-sm bg-white hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={imageError || !images[currentImageIndex] ? '/api/placeholder/600/400' : images[currentImageIndex]}
          alt={property.title}
          className="w-full h-48 object-cover rounded-xl"
          onError={handleImageError}
        />
      </div>
      <h3 className="text-xl font-semibold mt-2">{property.title}</h3>
      <p className="text-gray-500">{property.location.address}</p>
      <p className="text-green-600 font-bold text-lg mt-1">₹{property.price.toLocaleString()}</p>
      
      
    </div>
  );
};

export default PropertyCard;