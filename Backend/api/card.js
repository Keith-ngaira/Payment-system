import axios from 'axios';

class CardAPI {
  constructor() {
    // You would typically integrate with a payment processor like Stripe
    this.supportedCards = ['visa', 'mastercard'];
  }

  validateCard(cardNumber) {
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
  }

  getCardType(cardNumber) {
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

  validateExpiryDate(expiryDate) {
    const [month, year] = expiryDate.split('/').map(num => parseInt(num.trim()));
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Get last 2 digits of year
    const currentMonth = now.getMonth() + 1; // Months are 0-based

    if (!month || !year || month < 1 || month > 12) {
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }

  validateCVC(cvc) {
    return /^[0-9]{3,4}$/.test(cvc);
  }

  async processPayment(cardDetails, amount) {
    try {
      // Validate card details
      if (!this.validateCard(cardDetails.number)) {
        throw new Error('Invalid card number');
      }

      const cardType = this.getCardType(cardDetails.number);
      if (!this.supportedCards.includes(cardType)) {
        throw new Error('Unsupported card type');
      }

      if (!this.validateExpiryDate(cardDetails.expiry)) {
        throw new Error('Invalid expiry date');
      }

      if (!this.validateCVC(cardDetails.cvc)) {
        throw new Error('Invalid CVC');
      }

      // Here you would integrate with a payment processor like Stripe
      // This is a simulation of a successful payment
      const paymentResponse = {
        id: 'CARD-' + Math.random().toString(36).substr(2, 9),
        status: 'success',
        amount: amount,
        currency: 'USD',
        card: {
          type: cardType,
          last4: cardDetails.number.slice(-4)
        },
        timestamp: new Date().toISOString()
      };

      return paymentResponse;
    } catch (error) {
      throw new Error(`Card payment failed: ${error.message}`);
    }
  }

  async refundPayment(transactionId, amount) {
    try {
      // Here you would integrate with your payment processor's refund API
      // This is a simulation of a successful refund
      const refundResponse = {
        id: 'REF-' + Math.random().toString(36).substr(2, 9),
        originalTransaction: transactionId,
        status: 'success',
        amount: amount,
        currency: 'USD',
        timestamp: new Date().toISOString()
      };

      return refundResponse;
    } catch (error) {
      throw new Error('Failed to process refund');
    }
  }
}

export default new CardAPI();
