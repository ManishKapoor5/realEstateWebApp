import express from 'express';
import { getLimitConfig, updateLimitConfig } from '../controller/configController.js';
import accessTokenverify from '../middileware/acessTokenVerify.js';
import allowedRoles from '../middileware/roleAuthorization.js';

const router = express.Router();

router.route('/property-limits')
  .get(accessTokenverify, getLimitConfig)
  .put(accessTokenverify, allowedRoles('admin'), updateLimitConfig);

export default router;
