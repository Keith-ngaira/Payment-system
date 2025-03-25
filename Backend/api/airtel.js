import axios from 'axios';

class AirtelAPI {
  constructor() {
    this.clientId = process.env.AIRTEL_CLIENT_ID;
    this.clientSecret = process.env.AIRTEL_CLIENT_SECRET;
    this.baseURL = 'https://openapiuat.airtel.africa'; // Use production URL for live environment
    this.country = 'KE'; // Kenya
    this.currency = 'KES'; // Kenyan Shilling
  }

  async getAccessToken() {
    try {
      const response = await axios.post(
        `${this.baseURL}/auth/oauth2/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }
      );
      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to get Airtel Money access token');
    }
  }

  async initiatePayment(phoneNumber, amount) {
    try {
      const accessToken = await this.getAccessToken();
      const transactionId = 'TRX-' + Math.random().toString(36).substr(2, 9);
      const reference = 'PAY-' + Math.random().toString(36).substr(2, 9);

      const response = await axios.post(
        `${this.baseURL}/merchant/v1/payments`,
        {
          reference: reference,
          subscriber: {
            country: this.country,
            currency: this.currency,
            msisdn: phoneNumber,
          },
          transaction: {
            amount: amount,
            country: this.country,
            currency: this.currency,
            id: transactionId,
          },
        },
        {
          headers: {
            'X-Country': this.country,
            'X-Currency': this.currency,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return {
        ...response.data,
        transactionId,
        reference,
      };
    } catch (error) {
      throw new Error('Failed to initiate Airtel Money payment');
    }
  }

  async checkTransactionStatus(transactionId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(
        `${this.baseURL}/standard/v1/payments/${transactionId}`,
        {
          headers: {
            'X-Country': this.country,
            'X-Currency': this.currency,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to check Airtel Money transaction status');
    }
  }

  async refundPayment(transactionId, amount) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.post(
        `${this.baseURL}/standard/v1/payments/refund`,
        {
          transaction: {
            airtel_money_id: transactionId,
            amount: amount,
          },
        },
        {
          headers: {
            'X-Country': this.country,
            'X-Currency': this.currency,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to process Airtel Money refund');
    }
  }
}

export default new AirtelAPI();
