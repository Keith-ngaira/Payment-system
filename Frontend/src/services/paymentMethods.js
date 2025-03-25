import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend API URL

export const paymentMethods = {
  // PayPal Integration
  paypal: {
    processPayment: async (amount) => {
      try {
        const response = await axios.post(`${API_URL}/paypal/process`, { amount });
        return response.data;
      } catch (error) {
        throw new Error('PayPal payment failed: ' + error.message);
      }
    }
  },

  // M-Pesa Integration
  mpesa: {
    initiatePayment: async (phoneNumber, amount) => {
      try {
        const response = await axios.post(`${API_URL}/mpesa/initiate`, {
          phoneNumber,
          amount
        });
        return response.data;
      } catch (error) {
        throw new Error('M-Pesa payment failed: ' + error.message);
      }
    },
    confirmPayment: async (transactionId) => {
      try {
        const response = await axios.post(`${API_URL}/mpesa/confirm`, {
          transactionId
        });
        return response.data;
      } catch (error) {
        throw new Error('M-Pesa confirmation failed: ' + error.message);
      }
    }
  },

  // Airtel Money Integration
  airtel: {
    initiatePayment: async (phoneNumber, amount) => {
      try {
        const response = await axios.post(`${API_URL}/airtel/initiate`, {
          phoneNumber,
          amount
        });
        return response.data;
      } catch (error) {
        throw new Error('Airtel Money payment failed: ' + error.message);
      }
    },
    confirmPayment: async (transactionId) => {
      try {
        const response = await axios.post(`${API_URL}/airtel/confirm`, {
          transactionId
        });
        return response.data;
      } catch (error) {
        throw new Error('Airtel Money confirmation failed: ' + error.message);
      }
    }
  },

  // Credit Card Integration (Visa & Mastercard)
  card: {
    processPayment: async (cardDetails, amount) => {
      try {
        const response = await axios.post(`${API_URL}/card/process`, {
          cardDetails,
          amount
        });
        return response.data;
      } catch (error) {
        throw new Error('Card payment failed: ' + error.message);
      }
    },
    validateCard: (cardNumber) => {
      // Luhn algorithm for card validation
      let sum = 0;
      let isEven = false;

      // Loop through values starting from the rightmost side
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
        isEven = !isEven;
      }

      return sum % 10 === 0;
    },
    getCardType: (cardNumber) => {
      // Basic card type detection
      const patterns = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/
      };

      for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(cardNumber)) {
          return type;
        }
      }
      return 'unknown';
    }
  }
};
