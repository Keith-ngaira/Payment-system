import axios from 'axios';

class AirtelService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
    this.merchantId = import.meta.env.VITE_AIRTEL_MERCHANT_ID;
  }

  async initiatePayment(phoneNumber, amount) {
    try {
      const response = await axios.post(`${this.baseURL}/airtel/initiate`, {
        phoneNumber: this.formatPhoneNumber(phoneNumber),
        amount: parseFloat(amount)
      });

      return {
        success: true,
        transaction: response.data.transaction,
        reference: response.data.transaction.reference
      };
    } catch (error) {
      console.error('Airtel Money payment error:', error);
      throw new Error(error.response?.data?.error || 'Airtel Money payment failed');
    }
  }

  async checkPaymentStatus(transactionId) {
    try {
      const response = await axios.post(`${this.baseURL}/mobile/confirm`, {
        provider: 'airtel',
        transactionId: transactionId
      });

      return {
        success: true,
        status: response.data.status
      };
    } catch (error) {
      console.error('Airtel Money status check error:', error);
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

export default new AirtelService();
