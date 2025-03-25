import axios from 'axios';

class PayPalAPI {
  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID;
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    this.baseURL = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production
  }

  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const response = await axios.post(
        `${this.baseURL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to get PayPal access token');
    }
  }

  async createOrder(amount) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.post(
        `${this.baseURL}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: amount,
              },
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to create PayPal order');
    }
  }

  async capturePayment(orderId) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.post(
        `${this.baseURL}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to capture PayPal payment');
    }
  }
}

export default new PayPalAPI();
