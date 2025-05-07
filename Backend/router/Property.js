import express from 'express';
import * as propertyController  from '../controller/Property.js';
import { requiredLatLng, requiredCreateFields } from '../utils/propertyUtils.js';
import upload from '../middileware/propertyUplod.js';
import accessTokenverify from '../middileware/acessTokenVerify.js';
import allowedRoles from '../middileware/roleAuthorization.js';

const router = express.Router();

router.post(
  '/add',
  upload.array('images', 10),
  accessTokenverify,
  allowedRoles('seller', 'agent', 'admin'),
  requiredCreateFields,
  propertyController.createProperty
);

router.get('/getAll', accessTokenverify, propertyController.getAllProperties);
router.get('/getFrontPageAllProperties', propertyController.getFrontPageAllProperties);
router.get('/nearby', requiredLatLng, propertyController.getNearbyProperties);
router.get('/getby/:id', propertyController.getPropertyById);
router.put('/update/:id', propertyController.updateProperty);
router.delete('/delete/:id', propertyController.deleteProperty);
router.get(
  '/properties/seller/:sellerId',
  accessTokenverify,
  allowedRoles('seller', 'agent'),
  propertyController.getPropertiesBySeller
);
router.get(
  '/properties/agent/:agentId',
  accessTokenverify,
  allowedRoles('agent'),
  propertyController.getPropertiesByAgent
);
router.put('/approve/:id', propertyController.getPropertyApprovebyId);
router.put('/rejected/:id', propertyController.getPropertyRejectbyId);

export default router;
