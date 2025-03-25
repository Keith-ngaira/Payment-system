import axios from 'axios';

class MPesaService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
    this.shortcode = import.meta.env.VITE_MPESA_SHORTCODE;
  }

  async initiatePayment(phoneNumber, amount) {
    try {
      const response = await axios.post(`${this.baseURL}/mpesa/initiate`, {
        phoneNumber: this.formatPhoneNumber(phoneNumber),
        amount: parseFloat(amount)
      });

      return {
        success: true,
        checkoutRequestID: response.data.checkoutRequestID
      };
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      throw new Error(error.response?.data?.error || 'M-Pesa payment failed');
    }
  }

  async checkPaymentStatus(checkoutRequestID) {
    try {
      const response = await axios.post(`${this.baseURL}/mobile/confirm`, {
        provider: 'mpesa',
        transactionId: checkoutRequestID
      });

      return {
        success: true,
        status: response.data.status
      };
    } catch (error) {
      console.error('M-Pesa status check error:', error);
      throw new Error(error.response?.data?.error || 'Failed to check payment status');
    }
  }

  formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Ensure the number starts with 254
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.slice(1);
    }
    if (!cleaned.startsWith('254')) {
      return '254' + cleaned;
    }
    return cleaned;
  }
}

export default new MPesaService();
