import axios from 'axios';

class CardService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
  }

  validateCard(cardDetails) {
    const errors = {};

    // Validate card number using Luhn algorithm
    if (!this.isValidCardNumber(cardDetails.number)) {
      errors.number = 'Invalid card number';
    }

    // Validate expiry date
    if (!this.isValidExpiryDate(cardDetails.expiry)) {
      errors.expiry = 'Invalid expiry date';
    }

    // Validate CVC
    if (!this.isValidCVC(cardDetails.cvc)) {
      errors.cvc = 'Invalid CVC';
    }

    // Validate cardholder name
    if (!cardDetails.name || cardDetails.name.trim().length < 3) {
      errors.name = 'Invalid cardholder name';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  async processPayment(cardDetails, amount) {
    try {
      // Validate card details before making API call
      const validation = this.validateCard(cardDetails);
      if (!validation.isValid) {
        throw new Error('Invalid card details');
      }

      const response = await axios.post(`${this.baseURL}/card/process`, {
        cardDetails: {
          ...cardDetails,
          number: cardDetails.number.replace(/\s/g, '') // Remove spaces
        },
        amount: parseFloat(amount)
      });

      return {
        success: true,
        transaction: response.data.transaction
      };
    } catch (error) {
      console.error('Card payment error:', error);
      throw new Error(error.response?.data?.error || 'Card payment failed');
    }
  }

  isValidCardNumber(number) {
    // Remove any spaces or dashes
    const cleaned = number.replace(/[\s-]/g, '');
    
    // Check if it's a valid length and only contains digits
    if (!/^\d{16}$/.test(cleaned)) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    // Loop through values starting from the rightmost side
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));

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
  }

  isValidExpiryDate(expiry) {
    // Check format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return false;
    }

    const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    // Check if month is valid
    if (month < 1 || month > 12) {
      return false;
    }

    // Check if the expiry date is in the past
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }

  isValidCVC(cvc) {
    // CVC should be 3 or 4 digits
    return /^\d{3,4}$/.test(cvc);
  }

  getCardType(number) {
    // Remove any spaces or dashes
    const cleaned = number.replace(/[\s-]/g, '');
    
    // Regular expressions for card types
    const patterns = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleaned)) {
        return type;
      }
    }

    return 'unknown';
  }
}

export default new CardService();
