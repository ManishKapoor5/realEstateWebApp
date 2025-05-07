// src/pages/AddProperty.tsx
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const AddProperty = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'apartment',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      latitude: '',
      longitude: '',
    },
    features: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      parking: false,
      furnished: false,
    },
    images: [''],
    status: 'available',
  });

  const handleChange = (e: any, group?: string) => {
    const { name, value, type, checked } = e.target;
    if (group) {
      setFormData((prev) => ({
        ...prev,
        [group]: {
          ...prev[group],
          [name]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      features: {
        ...formData.features,
        bedrooms: Number(formData.features.bedrooms),
        bathrooms: Number(formData.features.bathrooms),
        area: Number(formData.features.area),
      },
      location: {
        ...formData.location,
        latitude: Number(formData.location.latitude),
        longitude: Number(formData.location.longitude),
      },
      owner: {
        name: user?.fullName,
        contact: user?.contactNumber || '',
        email: user?.email,
      },
      sellerId: user?._id,
    };

    try {
      await axios.post('https://realestatesite-backend.onrender.com/api/v1/Property/add', payload);
      alert('Property added successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add property');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Add New Property</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="p-2 border rounded" required />
        <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" className="p-2 border rounded" required />
        <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" className="p-2 border rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded md:col-span-2" required />

        {/* Location */}
        {Object.keys(formData.location).map((key) => (
          <input
            key={key}
            name={key}
            value={formData.location[key as keyof typeof formData.location]}
            onChange={(e) => handleChange(e, 'location')}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            className="p-2 border rounded"
            required
          />
        ))}

        {/* Features */}
        {['bedrooms', 'bathrooms', 'area'].map((key) => (
          <input
            key={key}
            name={key}
            value={formData.features[key]}
            onChange={(e) => handleChange(e, 'features')}
            placeholder={key}
            className="p-2 border rounded"
            type="number"
            required
          />
        ))}

        <label className="flex items-center">
          <input type="checkbox" name="parking" checked={formData.features.parking} onChange={(e) => handleChange(e, 'features')} className="mr-2" /> Parking
        </label>
        <label className="flex items-center">
          <input type="checkbox" name="furnished" checked={formData.features.furnished} onChange={(e) => handleChange(e, 'features')} className="mr-2" /> Furnished
        </label>

        {/* Images */}
        {formData.images.map((url, i) => (
          <input
            key={i}
            value={url}
            onChange={(e) => handleImageChange(i, e.target.value)}
            placeholder={`Image URL ${i + 1}`}
            className="p-2 border rounded col-span-2"
          />
        ))}
        <button type="button" onClick={addImageField} className="text-sm text-blue-500 col-span-2">+ Add another image</button>

        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded col-span-2">Submit</button>
      </form>
    </div>
  );
};

export default AddProperty;