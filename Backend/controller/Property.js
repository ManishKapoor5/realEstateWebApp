import Property from '../schema/Property.js';
import mongoose from 'mongoose';

// ✅ Create New Property
export const createProperty = async (req, res) => {
  try {
    const imagePaths = req.files?.map(file => file.path) || [];
    const newProperty = new Property({
      ...req.body,
      images: imagePaths,
    });
    await newProperty.save();

    res.status(201).json({ success: true, property: newProperty });
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// 📍 Get Nearby Properties (within 30km)
export const getNearbyProperties = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
  }

  try {
    const properties = await Property.find({
      geo: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 30000, // 30km
        },
      },
    });

    res.json({ success: true, properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 📄 Get All Properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

// 📄 Get Front Page All Properties
export const getFrontPageAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

// 🔍 Get Property by ID
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

// ✏️ Update Property
export const updateProperty = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, property: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ❌ Delete Property
export const deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

export const getPropertiesBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params; // Assuming sellerId is passed as a URL parameter

    // Find all properties where sellerId matches
    const properties = await Property.find({ sellerId });

    if (properties.length === -1) {
      return res.status(404).json({
        success: false,
        message: 'No properties found for this seller',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Properties fetched successfully',
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching properties by seller:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching properties',
      error: error.message,
    });
  }
};

export const getPropertiesByAgent = async (req, res) => {
  try {
    const { agentId } = req.params; // Assuming agentId is passed as a URL parameter

    // Find all properties where agentId matches
    const properties = await Property.find({ agentId });

    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No properties found for this agent',
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Properties fetched successfully',
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching properties by agent:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching properties',
      error: error.message,
    });
  }
};

export const getPropertyRejectbyId = async (req, res) => {
  try {
    // Find property by ID
    const property = await Property.findById(req.params.id);

    // Check if property exists
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    console.log('Rejected property by id------>', property);

    // Update approval status
    property.approval = 'rejected';
    await property.save();

    // Send response
    res.status(200).json({
      success: true,
      message: 'Property rejected successfully',
      property: {
        _id: property._id,
        title: property.title,
        address: property.address,
        approval: property.approval,
        status: property.status,
      },
    });
  } catch (err) {
    console.error('Error rejecting property:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting property',
      error: err.message,
    });
  }
};

export const getPropertyApprovebyId = async (req, res) => {
  try {
    // Find property by ID
    const property = await Property.findById(req.params.id);

    // Check if property exists
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    console.log('Approved property by id------>', property);

    // Update approval status
    property.approval = 'approved';
    await property.save();

    // Send response
    res.status(200).json({
      success: true,
      message: 'Property approved successfully',
      property: {
        _id: property._id,
        title: property.title,
        address: property.address,
        approval: property.approval,
        status: property.status,
      },
    });
  } catch (err) {
    console.error('Error approving property:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while approving property',
      error: err.message,
    });
  }
};
