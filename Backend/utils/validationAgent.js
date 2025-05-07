import { body, validationResult } from 'express-validator';

// Validation rules for agent registration
export const agentRegistrationValidationRules = () => {
  return [
    body('fullName')
      .notEmpty().withMessage('Full name is required')
      .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
    
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/).withMessage('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('contactNumber')
      .notEmpty().withMessage('Contact number is required')
      .isNumeric().withMessage('Contact number must be numeric')
      .isLength({ min: 10, max: 15 }).withMessage('Contact number must be between 10 and 15 digits'),
    
    body('licenseNumber')
      .notEmpty().withMessage('License number is required')
      .isLength({ min: 5 }).withMessage('License number must be at least 5 characters'),
    
    body('yearsOfExperience')
      .notEmpty().withMessage('Years of experience is required')
      .isInt({ min: 0 }).withMessage('Years of experience must be a positive number'),
    
    body('specialization')
      .isArray().withMessage('Specialization must be an array')
      .notEmpty().withMessage('At least one specialization is required')
  ];
};

// Login validation rules
export const loginValidationRules = () => {
  return [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Password is required')
  ];
};

// Agent profile update validation rules
export const agentUpdateValidationRules = () => {
  return [
    body('fullName')
      .optional()
      .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
    
    body('contactNumber')
      .optional()
      .isNumeric().withMessage('Contact number must be numeric')
      .isLength({ min: 10, max: 15 }).withMessage('Contact number must be between 10 and 15 digits'),
    
    body('yearsOfExperience')
      .optional()
      .isInt({ min: 0 }).withMessage('Years of experience must be a positive number'),
    
    body('specialization')
      .optional()
      .isArray().withMessage('Specialization must be an array')
      .notEmpty().withMessage('At least one specialization is required')
  ];
};

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    message: 'Validation failed',
    errors: extractedErrors,
  });
};
