import express from 'express';
import {
  processPayPalPayment,
  processMPesaPayment,
  processAirtelPayment,
  processCardPayment,
  confirmMobilePayment
} from '../controllers/paymentController.js';
import {
  validateRequest,
  paypalSchema,
  mpesaSchema,
  airtelSchema,
  cardSchema,
  mobileConfirmationSchema
} from '../validation/paymentValidation.js';

const router = express.Router();

// PayPal routes
router.post('/paypal/process', validateRequest(paypalSchema), processPayPalPayment);

// M-Pesa routes
router.post('/mpesa/initiate', validateRequest(mpesaSchema), processMPesaPayment);
router.post('/mpesa/confirm', validateRequest(mobileConfirmationSchema), confirmMobilePayment);

// Airtel Money routes
router.post('/airtel/initiate', validateRequest(airtelSchema), processAirtelPayment);
router.post('/airtel/confirm', validateRequest(mobileConfirmationSchema), confirmMobilePayment);

// Credit Card routes (Visa & Mastercard)
router.post('/card/process', validateRequest(cardSchema), processCardPayment);

export default router;
