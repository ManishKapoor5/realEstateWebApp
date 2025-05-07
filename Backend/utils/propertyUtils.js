// ✅ Generic: Validate required query parameters
export const validateQueryParams = (requiredParams) => {
  return (req, res, next) => {
    const missing = requiredParams.filter((key) => !req.query[key]);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing query parameter(s): ${missing.join(', ')}`,
      });
    }
    next();
  };
};

// ✅ Generic: Validate required body fields (deep support optional, but flat only here)
export const validateBodyFields = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter((key) => {
      const keys = key.split('.');
      let value = req.body;
      for (const k of keys) {
        if (value && Object.prototype.hasOwnProperty.call(value, k)) {
          value = value[k];
        } else {
          return true; // missing
        }
      }
      return false; // present
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing body field(s): ${missing.join(', ')}`,
      });
    }

    next();
  };
};

// 🔐 Specific middleware exports
export const requiredLatLng = validateQueryParams(['lat', 'lng']);

export const requiredCreateFields = validateBodyFields([
  'title',
  'description',
  'price',
  'type',
  'location.address',
  'location.city',
  'location.state',
  'location.country',
  'location.postalCode',
  'location.latitude',
  'location.longitude',
  'features.bedrooms',
  'features.bathrooms',
  'features.area',
  'owner.name',
  'owner.contact',
  'owner.email',
  'sellerId',
]);
