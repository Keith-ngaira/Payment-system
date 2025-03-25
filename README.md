# Client Payment Portal

A modern, secure payment processing system that supports multiple payment methods including PayPal, M-Pesa, Airtel Money, and credit cards.

## Features

- 🌐 Multiple Payment Methods
  - PayPal integration
  - M-Pesa mobile money
  - Airtel Money
  - Credit Cards (Visa & Mastercard)
- 🎨 Modern UI/UX
  - Responsive design
  - Smooth animations
  - Real-time validation
  - Payment status tracking
- 🔒 Security Features
  - Input validation
  - Secure API endpoints
  - Environment variable configuration
  - Card number validation (Luhn algorithm)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A PayPal Developer account
- M-Pesa API credentials
- Airtel Money API credentials

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Payment/Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the Frontend directory with the following:
```env
VITE_API_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_MPESA_SHORTCODE=your_mpesa_shortcode
VITE_AIRTEL_MERCHANT_ID=your_airtel_merchant_id
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5175`

## Testing

### Test Credentials

#### PayPal Sandbox
- Email: sb-47ckf22589357@personal.example.com
- Password: [Your sandbox account password]

#### M-Pesa Test
- Phone Number: 254708374149
- Amount: Any amount

#### Airtel Money Test
- Phone Number: 254708374149
- Amount: Any amount

#### Credit Card Test
- Card Number: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits
- Name: Any name

## Project Structure

```
Frontend/
├── src/
│   ├── components/      # React components
│   ├── services/        # Payment service integrations
│   ├── assets/         # Static assets
│   └── App.jsx         # Main application component
├── public/             # Public assets
├── .env               # Environment variables
└── package.json       # Project dependencies
```

## Payment Services

### PayPal
- Integration using `@paypal/react-paypal-js`
- Sandbox environment for testing
- Real-time payment processing

### M-Pesa
- Phone number validation
- Status checking with polling
- Timeout after 2 minutes

### Airtel Money
- Similar to M-Pesa implementation
- Transaction status monitoring
- Error handling

### Credit Card
- Card number validation (Luhn algorithm)
- Expiry date validation
- CVC validation
- Support for major card providers

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact keithngaira5@gmail.com or create an issue in the repository.
