// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

// // Define the Property interface
// interface Property {
//   _id: string;
//   title: string;
//   location: {
//     address: string;
//     city: string;
//     state: string;
//     country: string;
//     postalCode: string;
//     latitude: number;
//     longitude: number;
//   };
//   price: string;
//   bedrooms: number;
//   bathrooms: number;
//   area: string;
//   size: string;
//   images: string | string[];
//   status: string;
//   features: {
//     parking: boolean;
//     furnished: boolean;
//     bedrooms: number;
//     bathrooms: number;
//     area?: number;
//   };
//   propertyType: string;
//   type: string;
//   owner: {
//     name: string;
//     email: string;
//     contact: string;
//   };
//   description: string;
//   isNew?: boolean;
//   isVerified?: boolean;
// }

// const EachPropertyDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [property, setProperty] = useState<Property | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // State for buyer form and submission
//   const [buyerDetails, setBuyerDetails] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//     propertyId: "",
//   });
//   const [formError, setFormError] = useState<string | null>(null);
//   const [formSuccess, setFormSuccess] = useState<string | null>(null);
//   const [formSubmitting, setFormSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`https://realestatesite-backend.onrender.com/api/v1/Property/getby/${id}`);
//         const data = response.data;
//         console.log("API Response for ID", id, ":", data);

//         if (!data.success || !data.property) {
//           throw new Error("Property not found or invalid response");
//         }

//         const apiProperty = data.property;

//         const formattedProperty: Property = {
//           _id: apiProperty._id || "",
//           title: apiProperty.title || "",
//           location: {
//             address: apiProperty.location?.address || "",
//             city: apiProperty.location?.city || "",
//             state: apiProperty.location?.state || "",
//             country: apiProperty.location?.country || "",
//             postalCode: apiProperty.location?.postalCode || "",
//             latitude: apiProperty.geo?.coordinates?.[0] || 0,
//             longitude: apiProperty.geo?.coordinates?.[1] || 0,
//           },
//           price: apiProperty.price?.toString() || "0",
//           bedrooms: apiProperty.features?.bedrooms || 0,
//           bathrooms: apiProperty.features?.bathrooms || 0,
//           area: apiProperty.area || apiProperty.size || apiProperty.features?.area?.toString() || "0",
//           size: apiProperty.size || apiProperty.area || apiProperty.features?.area?.toString() || "0",
//           images: Array.isArray(apiProperty.images) ? apiProperty.images : apiProperty.images ? [apiProperty.images] : [],
//           status: apiProperty.status || "",
//           features: {
//             parking: apiProperty.features?.parking || false,
//             furnished: apiProperty.features?.furnished || false,
//             bedrooms: apiProperty.features?.bedrooms || 0,
//             bathrooms: apiProperty.features?.bathrooms || 0,
//             area: apiProperty.features?.area || 0,
//           },
//           propertyType: apiProperty.type || "",
//           type: apiProperty.type || "",
//           owner: {
//             name: apiProperty.owner?.name || "",
//             email: apiProperty.owner?.email || "",
//             contact: apiProperty.owner?.contact || "",
//           },
//           description: apiProperty.description || "",
//           isNew: apiProperty.isNew || false,
//           isVerified: apiProperty.isVerified || false,
//         };

//         setProperty(formattedProperty);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching property:", err);
//         setError(err instanceof Error ? err.message : "Failed to fetch property details");
//         setProperty(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperty();
//   }, [id]);

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setBuyerDetails((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormError(null);
//     setFormSuccess(null);
//     setFormSubmitting(true);

//     // Basic validation
//     if (!buyerDetails.name || !buyerDetails.email || !buyerDetails.phone) {
//       setFormError("Please fill in all required fields (Name, Email, Phone).");
//       setFormSubmitting(false);
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(buyerDetails.email)) {
//       setFormError("Please enter a valid email address.");
//       setFormSubmitting(false);
//       return;
//     }

//     try {
//       // Send inquiry to admin via API
      
//       const response = await axios.post("https://realestatesite-backend.onrender.com/api/v1/inquiry", {
//   fullName: buyerDetails.name,
//   email: buyerDetails.email,
//   contactNumber: buyerDetails.phone,
//   message: buyerDetails.message || '', // optional,
// });


//       if (response.data) {
//         setFormSuccess("Your inquiry has been sent to the admin successfully!");
//         setBuyerDetails({ name: "", email: "", phone: "", message: "", propertyId : "" });
//       } else {
//         throw new Error("Failed to submit inquiry.");
//       }
//     } catch (err) {
//       setFormError("Failed to submit your inquiry. Please try again.");
//       console.error("Error submitting inquiry:", err);
//     } finally {
//       setFormSubmitting(false);
//     }
//   };

//   // Get property images as array
//   const getPropertyImages = (property: Property): string[] => {
//     if (!property.images) return [];
//     if (typeof property.images === "string") return [property.images];
//     return property.images;
//   };

//   // Navigate to next image
//   const nextImage = () => {
//     if (!property) return;
//     const images = getPropertyImages(property);
//     if (images.length <= 1) return;
//     setCurrentImageIndex((prev) => (prev + 1) % images.length);
//   };

//   // Navigate to previous image
//   const prevImage = () => {
//     if (!property) return;
//     const images = getPropertyImages(property);
//     if (images.length <= 1) return;
//     setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="py-24 bg-gray-50 flex justify-center items-center">
//         <div className="text-center">
//           <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading property details...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error || !property) {
//     return (
//       <div className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
//               <h3 className="text-red-700 font-medium text-lg mb-2">Unable to load property</h3>
//               <p className="text-red-600">{error || "Property not found"}</p>
//               <button
//                 onClick={() => navigate("/")}
//                 className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//               >
//                 Go Back
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-12 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <button
//           onClick={() => navigate("/")}
//           className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
//         >
//           <ChevronLeft className="h-5 w-5 mr-1" />
//           Back to Properties
//         </button>

//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
//           <p className="text-gray-600 mb-2">
//             {property.location.address} {property.location.city} {property.location.state}
//           </p>
//           <p className="text-blue-600 font-bold text-xl mb-4">
//             ₹{parseFloat(property.price).toLocaleString("en-IN")}
//           </p>

//           {/* Property Images Gallery */}
//           <div className="mb-6">
//             <div className="bg-gray-100 rounded-lg overflow-hidden h-72 relative">
//               {getPropertyImages(property).length > 0 ? (
//                 <>
//                   <img
//                     src={getPropertyImages(property)[currentImageIndex]}
//                     alt={`${property.title} - Image ${currentImageIndex + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                   {getPropertyImages(property).length > 1 && (
//                     <>
//                       <button
//                         onClick={prevImage}
//                         className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white bg-opacity-80 rounded-full shadow flex items-center justify-center hover:bg-opacity-100"
//                         aria-label="Previous image"
//                       >
//                         <ChevronLeft className="h-5 w-5 text-gray-700" />
//                       </button>
//                       <button
//                         onClick={nextImage}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white bg-opacity-80 rounded-full shadow flex items-center justify-center hover:bg-opacity-100"
//                         aria-label="Next image"
//                       >
//                         <ChevronRight className="h-5 w-5 text-gray-700" />
//                       </button>
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                   <p className="text-gray-500">No images available</p>
//                 </div>
//               )}
//             </div>

//             {getPropertyImages(property).length > 1 && (
//               <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
//                 {getPropertyImages(property).map((image, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentImageIndex(index)}
//                     className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
//                       currentImageIndex === index ? "border-blue-500" : "border-transparent"
//                     }`}
//                   >
//                     <img
//                       src={image}
//                       alt={`Thumbnail ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Property Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <h3 className="text-lg font-semibold mb-3">Property Details</h3>
//               <ul className="space-y-2">
//                 <li className="flex items-center">
//                   <span className="w-32 text-gray-600">Property Type:</span>
//                   <span className="font-medium">{property.propertyType}</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-32 text-gray-600">Status:</span>
//                   <span className="font-medium">{property.status}</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-32 text-gray-600">Bedrooms:</span>
//                   <span className="font-medium">{property.bedrooms}</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-32 text-gray-600">Bathrooms:</span>
//                   <span className="font-medium">{property.bathrooms}</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-32 text-gray-600">Area:</span>
//                   <span className="font-medium">{property.features.area} sq.ft</span>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-3">Features</h3>
//               <ul className="space-y-2">
//                 <li className="flex items-center">
//                   <span className="w-32 text-gray-600">Parking:</span>
//                   <span className="font-medium">{property.features.parking ? "Yes" : "No"}</span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-32 text-gray-600">Furnished:</span>
//                   <span className="font-medium">{property.features.furnished ? "Yes" : "No"}</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Description</h3>
//             <p className="text-gray-700">{property.description}</p>
//           </div>

//           {/* Buyer Details Form */}
//           <div className="bg-blue-50 p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-2">Interested in this Property?</h3>
//             <p className="text-gray-600 mb-4">Fill in your details below to send an inquiry to the admin.</p>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="name" className="block text-gray-600 mb-1">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={buyerDetails.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Your full name"
//                   required
//                   disabled={formSubmitting}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-gray-600 mb-1">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={buyerDetails.email}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Your email address"
//                   required
//                   disabled={formSubmitting}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="phone" className="block text-gray-600 mb-1">
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={buyerDetails.phone}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Your phone number"
//                   required
//                   disabled={formSubmitting}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="message" className="block text-gray-600 mb-1">
//                   Message (Optional)
//                 </label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   value={buyerDetails.message}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Any additional information or questions"
//                   rows={4}
//                   disabled={formSubmitting}
//                 />
//               </div>

//               {formError && <div className="text-red-600 text-sm">{formError}</div>}
//               {formSuccess && <div className="text-green-600 text-sm">{formSuccess}</div>}

//               <button
//                 type="submit"
//                 className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
//                 disabled={formSubmitting}
//               >
//                 {formSubmitting ? (
//                   <>
//                     <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit Inquiry"
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-6 flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={() => navigate("/")}
//               className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
//             >
//               Back
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EachPropertyDetails;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Lock, Home, Square, Bed, Bath, Car, Coffee } from "lucide-react";

// Define the Property interface
interface Property {
  _id: string;
  title: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  size: string;
  images: string | string[];
  status: string;
  features: {
    parking: boolean;
    furnished: boolean;
    bedrooms: number;
    bathrooms: number;
    area?: number;
  };
  propertyType: string;
  type: string;
  owner: {
    name: string;
    email: string;
    contact: string;
  };
  description: string;
  isNew?: boolean;
  isVerified?: boolean;
}

const EachPropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://realestatesite-backend.onrender.com/api/v1/Property/getby/${id}`);
        const data = response.data;
        console.log("API Response for ID", id, ":", data);

        if (!data.success || !data.property) {
          throw new Error("Property not found or invalid response");
        }

        const apiProperty = data.property;

        const formattedProperty: Property = {
          _id: apiProperty._id || "",
          title: apiProperty.title || "",
          location: {
            address: apiProperty.location?.address || "",
            city: apiProperty.location?.city || "",
            state: apiProperty.location?.state || "",
            country: apiProperty.location?.country || "",
            postalCode: apiProperty.location?.postalCode || "",
            latitude: apiProperty.geo?.coordinates?.[0] || 0,
            longitude: apiProperty.geo?.coordinates?.[1] || 0,
          },
          price: apiProperty.price?.toString() || "0",
          bedrooms: apiProperty.features?.bedrooms || 0,
          bathrooms: apiProperty.features?.bathrooms || 0,
          area: apiProperty.area || apiProperty.size || apiProperty.features?.area?.toString() || "0",
          size: apiProperty.size || apiProperty.area || apiProperty.features?.area?.toString() || "0",
          images: Array.isArray(apiProperty.images) ? apiProperty.images : apiProperty.images ? [apiProperty.images] : [],
          status: apiProperty.status || "",
          features: {
            parking: apiProperty.features?.parking || false,
            furnished: apiProperty.features?.furnished || false,
            bedrooms: apiProperty.features?.bedrooms || 0,
            bathrooms: apiProperty.features?.bathrooms || 0,
            area: apiProperty.features?.area || 0,
          },
          propertyType: apiProperty.type || "",
          type: apiProperty.type || "",
          owner: {
            name: apiProperty.owner?.name || "",
            email: apiProperty.owner?.email || "",
            contact: apiProperty.owner?.contact || "",
          },
          description: apiProperty.description || "",
          isNew: apiProperty.isNew || false,
          isVerified: apiProperty.isVerified || false,
        };

        setProperty(formattedProperty);
        setError(null);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch property details");
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Get property images as array
  const getPropertyImages = (property: Property): string[] => {
    if (!property.images) return [];
    if (typeof property.images === "string") return [property.images];
    return property.images;
  };

  // Navigate to next image
  const nextImage = () => {
    if (!property) return;
    const images = getPropertyImages(property);
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  // Navigate to previous image
  const prevImage = () => {
    if (!property) return;
    const images = getPropertyImages(property);
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Mask contact information
  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    if (!username || !domain) return "***@***";
    return `${username.substring(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 6) return "******";
    return `${phone.substring(0, 2)}****${phone.substring(phone.length - 2)}`;
  };

  // Handle contact click - redirect to login
  const handleContactClick = () => {
    navigate("/login", { state: { from: `/property/${id}`, message: "Please login to view contact details" } });
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-24 bg-gray-50 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto shadow-sm">
              <h3 className="text-red-700 font-semibold text-xl mb-3">Unable to load property</h3>
              <p className="text-red-600">{error || "Property not found"}</p>
              <button
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Properties
        </button>

        {/* Main Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-100">
                {getPropertyImages(property).length > 0 ? (
                  <>
                    <img
                      src={getPropertyImages(property)[currentImageIndex]}
                      alt={`${property.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {getPropertyImages(property).length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white bg-opacity-80 rounded-full shadow-md flex items-center justify-center hover:bg-opacity-100 transition-all"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-6 w-6 text-gray-700" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white bg-opacity-80 rounded-full shadow-md flex items-center justify-center hover:bg-opacity-100 transition-all"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-6 w-6 text-gray-700" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {getPropertyImages(property).length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {getPropertyImages(property).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                          currentImageIndex === index ? "border-blue-500 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details Section */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <Home className="mr-2 h-5 w-5 text-blue-600" />
                Property Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-36 text-gray-600">Property Type:</div>
                    <div className="font-medium text-gray-800">{property.propertyType || "Residential"}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-36 text-gray-600">Status:</div>
                    <div className="font-medium">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.status === "For Sale" ? "bg-green-100 text-green-800" : 
                        property.status === "For Rent" ? "bg-blue-100 text-blue-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {property.status || "Available"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-36 text-gray-600">Area:</div>
                    <div className="font-medium text-gray-800 flex items-center">
                      <Square className="h-4 w-4 mr-1 text-blue-600" />
                      {property.features.area} sq.ft
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-36 text-gray-600">Bedrooms:</div>
                    <div className="font-medium text-gray-800 flex items-center">
                      <Bed className="h-4 w-4 mr-1 text-blue-600" />
                      {property.bedrooms}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-36 text-gray-600">Bathrooms:</div>
                    <div className="font-medium text-gray-800 flex items-center">
                      <Bath className="h-4 w-4 mr-1 text-blue-600" />
                      {property.bathrooms}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-36 text-gray-600">Parking:</div>
                    <div className="font-medium text-gray-800 flex items-center">
                      <Car className="h-4 w-4 mr-1 text-blue-600" />
                      {property.features.parking ? "Available" : "Not Available"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-36 text-gray-600">Furnished:</div>
                  <div className="font-medium text-gray-800 flex items-center">
                    <Coffee className="h-4 w-4 mr-1 text-blue-600" />
                    {property.features.furnished ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Description</h3>
              <div className="prose text-gray-700">
                {property.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                Location
              </h3>
              <div className="text-gray-700 mb-4">
                <p className="mb-1">{property.location.address}</p>
                <p>{property.location.city}, {property.location.state} {property.location.postalCode}</p>
                <p>{property.location.country}</p>
              </div>
              
              {/* Placeholder for map - In a real implementation, you might use Google Maps or similar */}
              <div className="mt-4 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map view would be shown here</p>
              </div>
            </div>
          </div>

          {/* Right Column - Price & Contact */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <p className="text-gray-600 text-sm">
                    {property.location.city}, {property.location.state}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600">
                  ₹{parseFloat(property.price).toLocaleString("en-IN")}
                </div>
                {property.isVerified && (
                  <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </div>
                )}
                {property.isNew && (
                  <div className="mt-1 ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    New
                  </div>
                )}
              </div>

              {/* Owner/Contact Info */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-800 font-medium mb-1">
                    {property.owner.name}
                  </div>
                  
                  {/* Masked Contact Buttons */}
                  <div className="space-y-3 mt-4">
                    <button 
                      onClick={handleContactClick}
                      className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-600">{maskPhone(property.owner.contact)}</span>
                      </div>
                      <Lock className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    <button 
                      onClick={handleContactClick}
                      className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-600">{maskEmail(property.owner.email)}</span>
                      </div>
                      <Lock className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    <Lock className="h-3 w-3 inline-block mr-1" />
                    Login required to view full contact details
                  </div>
                </div>
                
                {/* Call to Action */}
                <button
                  onClick={handleContactClick}
                  className="mt-6 w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                >
                  View Contact Details
                </button>
                
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/")}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Return to property listings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EachPropertyDetails;