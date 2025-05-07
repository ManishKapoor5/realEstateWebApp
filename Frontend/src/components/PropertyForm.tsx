// import React, { useEffect, useRef, useState } from 'react';
// import { useAuthStore } from '@/store/authStore.js';
// import { Navigate, useNavigate } from 'react-router-dom';

// // Define props interface to accept userLocation
// interface PropertyFormProps {
//   userLocation: { latitude: number; longitude: number } | null;
// }

// const PropertyForm: React.FC<PropertyFormProps> = ({ userLocation }) => {
//   const [formData, setFormData] = useState({
//     sellerId: '',
//     title: '',
//     description: '',
//     price: '',
//     type: 'apartment',
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//     postalCode: '',
//     bedrooms: '',
//     bathrooms: '',
//     area: '',
//     parking: false,
//     furnished: false,
//     images: [] as (string | File)[],
//     ownerName: '',
//     ownerContact: '',
//     ownerEmail: '',
//     status: 'available',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const user = useAuthStore((state) => state.user);
//   const hiddenFileInput = useRef(null);
//   const navigate = useNavigate();
//   const [image, setImage] = useState<File | undefined>(undefined);
//   const { isAuthenticated, accessToken, refreshToken } = useAuthStore();

//   useEffect(() => {
//     const checkAuth = async () => {
//       setLoading(true);

//       if (!isAuthenticated) {
//         if (refreshToken) {
//           try {
//             const response = await fetch('https://realestatesite-backend.onrender.com/api/v1/RealEstateUser/refresh-token', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ refreshToken }),
//               credentials: 'include',
//             });

//             if (!response.ok) {
//               throw new Error('Token refresh failed');
//             }

//             setLoading(false);
//             return;
//           } catch (err) {
//             setError('Your session has expired. Please log in again.');
//             setTimeout(() => {
//               navigate('/login', { state: { from: '/Property/add' } });
//             }, 2000);
//             return;
//           }
//         } else {
//           navigate('/login', { state: { from: '/Property/add' } });
//           return;
//         }
//       }

//       setLoading(false);
//     };

//     checkAuth();
//   }, [isAuthenticated, navigate, refreshToken]);

//   const onFileInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     handleFileChange(index, file);
//   };

//   const handleFileChange = (index: number, file: File | undefined) => {
//     if (!file) return;
//     const newImages = [...formData.images];
//     newImages[index] = file as File;
//     setFormData({ ...formData, images: newImages });
//   };

//   const removeImageField = (index: number) => {
//     const newImages = [...formData.images];
//     newImages.splice(index, 1);
//     setFormData({ ...formData, images: newImages });
//   };

//   const addImageField = (file: File | undefined) => {
//     if (!file) return;
//     setFormData({ ...formData, images: [...formData.images, file] });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const fileArray = Array.from(files);
//       setFormData((prev) => ({
//         ...prev,
//         images: [...prev.images, ...fileArray],
//       }));
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target as HTMLInputElement;

//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess(false);

//     try {
//       // Require location access for submission
//       if (!userLocation) {
//         throw new Error('Location access is required to add a property.');
//       }

//       const form = new FormData();

//       form.append('sellerId', user._id);
//       form.append('title', formData.title);
//       form.append('description', formData.description);
//       form.append('price', formData.price);
//       form.append('type', formData.type);

//       // Location
//       form.append('location[address]', formData.address);
//       form.append('location[city]', formData.city);
//       form.append('location[state]', formData.state);
//       form.append('location[country]', formData.country);
//       form.append('location[postalCode]', formData.postalCode);
//       form.append('location[latitude]', userLocation.latitude.toString());
//       form.append('location[longitude]', userLocation.longitude.toString());

//       // Features
//       form.append('features[bedrooms]', formData.bedrooms);
//       form.append('features[bathrooms]', formData.bathrooms);
//       form.append('features[area]', formData.area);
//       form.append('features[parking]', formData.parking.toString());
//       form.append('features[furnished]', formData.furnished.toString());

//       // Owner
//       form.append('owner[name]', formData.ownerName);
//       form.append('owner[contact]', formData.ownerContact);
//       form.append('owner[email]', formData.ownerEmail);

//       form.append('status', formData.status);

//       // Images
//       formData.images.forEach((img: File) => {
//         if (img instanceof File) {
//           form.append('images', img);
//         }
//       });

//       // Debug form data
//       for (let pair of form.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       const response = await fetch(`https://realestatesite-backend.onrender.com/api/v1/Property/add`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: form,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit property');
//       }

//       const result = await response.json();
//       alert('Property submitted successfully!');
//       setSuccess(true);

//       // Reset form
//       setFormData({
//         sellerId: '',
//         title: '',
//         description: '',
//         price: '',
//         type: 'apartment',
//         address: '',
//         city: '',
//         state: '',
//         country: '',
//         postalCode: '',
//         bedrooms: '',
//         bathrooms: '',
//         area: '',
//         parking: false,
//         furnished: false,
//         images: [],
//         ownerName: '',
//         ownerContact: '',
//         ownerEmail: '',
//         status: 'available',
//       });
//     } catch (err: any) {
//       setError(err.message || 'Failed to add property');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6">Add New Property</h2>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           Property added successfully!
//         </div>
//       )}

//       {!userLocation && (
//         <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
//           Please allow location access to set property coordinates.
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Price (₹)</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 rows={4}
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Property Type</label>
//               <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               >
//                 <option value="apartment">Apartment</option>
//                 <option value="house">House</option>
//                 <option value="condo">Condo</option>
//                 <option value="villa">Villa</option>
//                 <option value="land">Land</option>
//                 <option value="commercial">Commercial</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               >
//                 <option value="available">Available</option>
//                 <option value="pending">Pending</option>
//                 <option value="sold">Sold</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-3">Location</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="md:col-span-2">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
//               <input
//                 type="text"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">State</label>
//               <input
//                 type="text"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
//               <input
//                 type="text"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Postal Code</label>
//               <input
//                 type="text"
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-3">Features</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Bedrooms</label>
//               <input
//                 type="number"
//                 name="bedrooms"
//                 value={formData.bedrooms}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Bathrooms</label>
//               <input
//                 type="number"
//                 name="bathrooms"
//                 value={formData.bathrooms}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Area (sq ft)</label>
//               <input
//                 type="number"
//                 name="area"
//                 value={formData.area}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="parking"
//                 checked={formData.parking}
//                 onChange={handleChange}
//                 className="mr-2"
//               />
//               <label className="text-gray-700 text-sm font-bold">Parking Available</label>
//             </div>

//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="furnished"
//                 checked={formData.furnished}
//                 onChange={handleChange}
//                 className="mr-2"
//               />
//               <label className="text-gray-700 text-sm font-bold">Furnished</label>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-4">Images</h3>
//           <div className="space-y-4">
//             {formData.images.map((image, index) => (
//               <div key={index} className="flex items-center gap-4">
//                 <img
//                   src={
//                     image
//                       ? typeof image === 'string'
//                         ? image
//                         : image instanceof File
//                         ? URL.createObjectURL(image)
//                         : 'https://placehold.co/600x400'
//                       : 'https://placehold.co/600x400'
//                   }
//                   alt={`Preview ${index + 1}`}
//                   className="w-24 h-24 rounded object-cover border shadow"
//                 />
//                 <div className="flex flex-col gap-2">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={onFileInputChange(index)}
//                     className="text-sm text-gray-700"
//                   />
//                   {formData.images.length > 0 && (
//                     <button
//                       type="button"
//                       onClick={() => removeImageField(index)}
//                       className="text-sm text-red-600 hover:underline"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6">
//             <label
//               htmlFor="newImage"
//               className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
//             >
//               + Add Image
//             </label>
//             <input
//               type="file"
//               id="newImage"
//               accept="image/*"
//               multiple
//               onChange={(e) => addImageField(e.target.files?.[0])}
//               className="hidden"
//             />
//           </div>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-3">Owner Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Owner Name</label>
//               <input
//                 type="text"
//                 name="ownerName"
//                 value={formData.ownerName}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
//               <input
//                 type="text"
//                 name="ownerContact"
//                 value={formData.ownerContact}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
//               <input
//                 type="email"
//                 name="ownerEmail"
//                 value={formData.ownerEmail}
//                 onChange={handleChange}
//                 className="shadow appearance-none border rounded w-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             disabled={loading}
//             className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
//               loading ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {loading ? 'Adding...' : 'Add Property'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PropertyForm;

// import React, { useEffect, useRef, useState } from 'react';
// import { useAuthStore } from '@/store/authStore.js';
// import { Navigate, useNavigate } from 'react-router-dom';



// interface PropertyFormProps {
//   userLocation: { latitude: number; longitude: number } | null;
//   onSuccess?: () => void;
// }

// const PropertyForm: React.FC<PropertyFormProps> = ({ userLocation }) => {
//   const [formData, setFormData] = useState({
//     sellerId: '',
//     title: '',
//     description: '',
//     price: '',
//     type: 'apartment',
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//     postalCode: '',
//     bedrooms: '',
//     bathrooms: '',
//     area: '',
//     parking: false,
//     furnished: false,
//     images: [] as File[],
//     ownerName: '',
//     ownerContact: '',
//     ownerEmail: '',
//     status: 'available',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const { user, isAuthenticated, accessToken, refreshToken } = useAuthStore();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       setLoading(true);
//       if (!isAuthenticated) {
//         if (refreshToken) {
//           try {
//             const response = await fetch('https://realestatesite-backend.onrender.com/api/v1/RealEstateUser/refresh-token', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ refreshToken }),
//               credentials: 'include',
//             });
//             if (!response.ok) throw new Error('Token refresh failed');
//           } catch (err) {
//             setError('Your session has expired. Please log in again.');
//             setTimeout(() => navigate('/login', { state: { from: '/Property/add' } }), 2000);
//             return;
//           }
//         } else {
//           navigate('/login', { state: { from: '/Property/add' } });
//           return;
//         }
//       }
//       setLoading(false);
//     };
//     checkAuth();
//   }, [isAuthenticated, navigate, refreshToken]);

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files.length) {
//       const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
//       setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length) {
//       const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
//       setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
//     }
//   };

//   const removeImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess(false);

//     try {
//       if (!userLocation) throw new Error('Location access is required to add a property.');
//       if (!user?._id) throw new Error('User authentication required.');

//       const form = new FormData();
//       form.append('sellerId', user._id);
//       form.append('title', formData.title);
//       form.append('description', formData.description);
//       form.append('price', formData.price);
//       form.append('type', formData.type);
//       form.append('location[address]', formData.address);
//       form.append('location[city]', formData.city);
//       form.append('location[state]', formData.state);
//       form.append('location[country]', formData.country);
//       form.append('location[postalCode]', formData.postalCode);
//       form.append('location[latitude]', userLocation.latitude.toString());
//       form.append('location[longitude]', userLocation.longitude.toString());
//       form.append('features[bedrooms]', formData.bedrooms);
//       form.append('features[bathrooms]', formData.bathrooms);
//       form.append('features[area]', formData.area);
//       form.append('features[parking]', formData.parking.toString());
//       form.append('features[furnished]', formData.furnished.toString());
//       form.append('owner[name]', formData.ownerName);
//       form.append('owner[contact]', formData.ownerContact);
//       form.append('owner[email]', formData.ownerEmail);
//       form.append('status', formData.status);

//       formData.images.forEach((img, index) => {
//         form.append('images', img, `image-${index}.${img.name.split('.').pop()}`);
//       });

//       const response = await fetch('https://localhost:3000/api/v1/Property/add', {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${accessToken}` },
//         body: form,
//       });

//       if (!response.ok) throw new Error('Failed to submit property');

//       await response.json();
//       setSuccess(true);
//       setFormData({
//         sellerId: '',
//         title: '',
//         description: '',
//         price: '',
//         type: 'apartment',
//         address: '',
//         city: '',
//         state: '',
//         country: '',
//         postalCode: '',
//         bedrooms: '',
//         bathrooms: '',
//         area: '',
//         parking: false,
//         furnished: false,
//         images: [],
//         ownerName: '',
//         ownerContact: '',
//         ownerEmail: '',
//         status: 'available',
//       });
//     } catch (err: any) {
//       setError(err.message || 'Failed to add property');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Property</h2>

//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>
//       )}
//       {success && (
//         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
//           Property added successfully!
//         </div>
//       )}
//       {!userLocation && (
//         <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
//           Please allow location access to set property coordinates.
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-8">
//         <div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//                 min="0"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 rows={4}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
//               <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="apartment">Apartment</option>
//                 <option value="house">House</option>
//                 <option value="condo">Condo</option>
//                 <option value="villa">Villa</option>
//                 <option value="land">Land</option>
//                 <option value="commercial">Commercial</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="available">Available</option>
//                 <option value="pending">Pending</option>
//                 <option value="sold">Sold</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">Location</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//               <input
//                 type="text"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//               <input
//                 type="text"
//                 name="state"
//                 value={formData.state}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//               <input
//                 type="text"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
//               <input
//                 type="text"
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">Features</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
//               <input
//                 type="number"
//                 name="bedrooms"
//                 value={formData.bedrooms}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//                 min="0"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
//               <input
//                 type="number"
//                 name="bathrooms"
//                 value={formData.bathrooms}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//                 min="0"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
//               <input
//                 type="number"
//                 name="area"
//                 value={formData.area}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//                 min="0"
//               />
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="parking"
//                 checked={formData.parking}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label className="ml-2 text-sm font-medium text-gray-700">Parking Available</label>
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="furnished"
//                 checked={formData.furnished}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label className="ml-2 text-sm font-medium text-gray-700">Furnished</label>
//             </div>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">Images</h3>
//           <div
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//             className={`border-2 border-dashed rounded-lg p-6 text-center ${
//               dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
//             }`}
//           >
//             <input
//               type="file"
//               ref={fileInputRef}
//               multiple
//               accept="image/*"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//             <p className="text-gray-600 mb-2">
//               Drag and drop images here or{' '}
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="text-blue-600 hover:underline"
//               >
//                 click to upload
//               </button>
//             </p>
//             <p className="text-sm text-gray-500">Supports multiple images (JPEG, PNG)</p>
//           </div>
//           {formData.images.length > 0 && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
//               {formData.images.map((image, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={URL.createObjectURL(image)}
//                     alt={`Preview ${index + 1}`}
//                     className="w-full h-32 object-cover rounded-lg shadow"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-4">Owner Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
//               <input
//                 type="text"
//                 name="ownerName"
//                 value={formData.ownerName}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
//               <input
//                 type="tel"
//                 name="ownerContact"
//                 value={formData.ownerContact}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 name="ownerEmail"
//                 value={formData.ownerEmail}
//                 onChange={handleChange}
//                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         <div>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
//               loading ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {loading ? 'Adding...' : 'Add Property'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PropertyForm;

import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore.js';
import { Navigate, useNavigate } from 'react-router-dom';

interface PropertyFormProps {
  userLocation: { latitude: number; longitude: number } | null;
  onSuccess?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ userLocation, onSuccess }) => {
  const [formData, setFormData] = useState({
    sellerId: '',
    title: '',
    description: '',
    price: '',
    type: 'apartment',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    parking: false,
    furnished: false,
    images: [] as File[],
    ownerName: '',
    ownerContact: '',
    ownerEmail: '',
    status: 'available',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { user, isAuthenticated, accessToken, refreshToken } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      if (!isAuthenticated) {
        if (refreshToken) {
          try {
            const response = await fetch('https://realestatesite-backend.onrender.com/api/v1/RealEstateUser/refresh-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
              credentials: 'include',
            });
            if (!response.ok) throw new Error('Token refresh failed');
          } catch (err) {
            setError('Your session has expired. Please log in again.');
            setTimeout(() => navigate('/login', { state: { from: '/Property/add' } }), 2000);
            return;
          }
        } else {
          navigate('/login', { state: { from: '/Property/add' } });
          return;
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [isAuthenticated, navigate, refreshToken]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Check if location access is available
      if (!userLocation) {
        throw new Error('Location access is required to add a property. Please allow location access and try again.');
      }
      
      if (!user?._id) {
        throw new Error('User authentication required.');
      }

      const form = new FormData();
      form.append('sellerId', user._id);
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('price', formData.price);
      form.append('type', formData.type);
      form.append('location[address]', formData.address);
      form.append('location[city]', formData.city);
      form.append('location[state]', formData.state);
      form.append('location[country]', formData.country);
      form.append('location[postalCode]', formData.postalCode);
      form.append('location[latitude]', userLocation.latitude.toString());
      form.append('location[longitude]', userLocation.longitude.toString());
      form.append('features[bedrooms]', formData.bedrooms);
      form.append('features[bathrooms]', formData.bathrooms);
      form.append('features[area]', formData.area);
      form.append('features[parking]', formData.parking.toString());
      form.append('features[furnished]', formData.furnished.toString());
      form.append('owner[name]', formData.ownerName);
      form.append('owner[contact]', formData.ownerContact);
      form.append('owner[email]', formData.ownerEmail);
      form.append('status', formData.status);

      formData.images.forEach((img, index) => {
        form.append('images', img, `image-${index}.${img.name.split('.').pop()}`);
      });

      // Fix: Use the correct backend URL
      const response = await fetch(`https://realestatesite-backend.onrender.com/api/v1/Property/add`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to submit property');
      }

      await response.json();
      setSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form data
      setFormData({
        sellerId: '',
        title: '',
        description: '',
        price: '',
        type: 'apartment',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        parking: false,
        furnished: false,
        images: [],
        ownerName: '',
        ownerContact: '',
        ownerEmail: '',
        status: 'available',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add property');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Property</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          Property added successfully!
        </div>
      )}
      {!userLocation && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-medium">Location access required</p>
          <p>Please allow location access in your browser to set property coordinates accurately.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="parking"
                checked={formData.parking}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                id="parking"
              />
              <label htmlFor="parking" className="ml-2 text-sm font-medium text-gray-700">Parking Available</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="furnished"
                checked={formData.furnished}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                id="furnished"
              />
              <label htmlFor="furnished" className="ml-2 text-sm font-medium text-gray-700">Furnished</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Images</h3>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-gray-600 mb-2">
              Drag and drop images here or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:underline"
              >
                click to upload
              </button>
            </p>
            <p className="text-sm text-gray-500">Supports multiple images (JPEG, PNG)</p>
          </div>
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Owner Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                name="ownerContact"
                value={formData.ownerContact}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;