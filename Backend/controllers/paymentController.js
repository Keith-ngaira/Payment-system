import axios from 'axios';
import dotenv from 'dotenv';
import { paypalAPI, mpesaAPI, airtelAPI, cardAPI } from '../api/index.js';

dotenv.config();

// PayPal payment processing
export const processPayPalPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentResponse = await paypalAPI.createOrder(amount);
    
    res.json({
      success: true,
      transaction: paymentResponse
    });
  } catch (error) {
    console.error('PayPal payment error:', error);
    res.status(500).json({
      success: false,
      error: 'PayPal payment processing failed'
    });
  }
};

// M-Pesa payment processing
export const processMPesaPayment = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    const paymentResponse = await mpesaAPI.initiateSTKPush(phoneNumber, amount);

    res.json({
      success: true,
      checkoutRequestID: paymentResponse.CheckoutRequestID
    });
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    res.status(500).json({
      success: false,
      error: 'M-Pesa payment processing failed'
    });
  }
};

// Airtel Money payment processing
export const processAirtelPayment = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    const paymentResponse = await airtelAPI.initiatePayment(phoneNumber, amount);

    res.json({
      success: true,
      transaction: paymentResponse
    });
  } catch (error) {
    console.error('Airtel Money payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Airtel Money payment processing failed'
    });
  }
};

// Credit Card payment processing (Visa & Mastercard)
export const processCardPayment = async (req, res) => {
  try {
    const { cardDetails, amount } = req.body;
    const paymentResponse = await cardAPI.processPayment(cardDetails, amount);

    res.json({
      success: true,
      transaction: paymentResponse
    });
  } catch (error) {
    console.error('Card payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Card payment processing failed'
    });
  }
};

// Confirm mobile payment (M-Pesa & Airtel)
export const confirmMobilePayment = async (req, res) => {
  try {
    const { provider, transactionId } = req.body;
    let status;

    switch (provider) {
      case 'mpesa':
        status = await mpesaAPI.checkTransactionStatus(transactionId);
        break;
      case 'airtel':
        status = await airtelAPI.checkTransactionStatus(transactionId);
        break;
      default:
        throw new Error('Invalid payment provider');
    }

    res.json({
      success: true,
      status: status
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment confirmation failed'
    });
  }
};
