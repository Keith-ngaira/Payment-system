# Multi-Payment Integration System

A comprehensive payment processing system that integrates multiple payment methods including PayPal, M-Pesa, Airtel Money, and credit cards. The system provides a modern, secure, and user-friendly interface for processing payments.

## System Architecture

### Frontend (React + Vite)
```
Frontend/
├── src/
│   ├── components/      # React components
│   │   └── PaymentForm  # Main payment form component
│   ├── services/        # Payment service integrations
│   │   ├── mpesa.js    # M-Pesa service
│   │   ├── airtel.js   # Airtel Money service
│   │   ├── card.js     # Credit card service
│   │   └── index.js    # Service exports
│   └── App.jsx         # Main application component
```

### Backend (Express.js)
```
Backend/
├── api/                # Payment API integrations
│   ├── mpesa.js       # M-Pesa API
│   ├── airtel.js      # Airtel Money API
│   ├── card.js        # Credit card processing
│   ├── paypal.js      # PayPal API
│   └── index.js       # API exports
├── controllers/        # Request handlers
├── routes/            # API routes
└── validation/        # Input validation
```

## Payment Methods

### 1. M-Pesa Integration
- **STK Push**: Initiates payment through M-Pesa's STK push
- **Features**:
  - Phone number validation
  - Real-time transaction status checking
  - Automatic timeout after 2 minutes
  - Sandbox testing support
- **Test Credentials**:
  - Phone: 254708374149
  - Amount: Any amount

### 2. Airtel Money
- **Features**:
  - Direct payment initiation
  - Transaction status monitoring
  - Refund capability
  - Error handling
- **Test Credentials**:
  - Phone: 254708374149
  - Amount: Any amount

### 3. Credit Card Processing
- **Supported Cards**: 
  - Visa
  - Mastercard
- **Features**:
  - Card number validation (Luhn algorithm)
  - Expiry date validation
  - CVC validation
  - Support for refunds
- **Test Card**:
  - Number: 4242 4242 4242 4242
  - Expiry: Any future date
  - CVC: Any 3 digits

### 4. PayPal Integration
- **Features**:
  - PayPal Smart Buttons
  - Order creation and capture
  - Sandbox environment support
- **Test Account**:
  - Email: sb-47ckf22589357@personal.example.com
  - Password: [Your sandbox password]

## Security Features

1. **Input Validation**
   - Phone number format validation
   - Card number validation (Luhn algorithm)
   - Amount validation
   - Expiry date validation

2. **API Security**
   - Rate limiting
   - CORS protection
   - Helmet security headers
   - Request size limiting

3. **Environment Variables**
   - Secure credential storage
   - Separate configurations for development and production
   - API keys and secrets management

## Getting Started

1. **Clone the Repository**
```bash
git clone <repository-url>
cd Payment
```

2. **Set Up Environment Variables**

Backend (.env):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5175

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_mpesa_passkey

# Airtel Money Configuration
AIRTEL_CLIENT_ID=your_airtel_client_id
AIRTEL_CLIENT_SECRET=your_airtel_client_secret
AIRTEL_MERCHANT_ID=your_airtel_merchant_id
```

Frontend (.env):
```env
VITE_API_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_MPESA_SHORTCODE=your_mpesa_shortcode
VITE_AIRTEL_MERCHANT_ID=your_airtel_merchant_id
```

3. **Install Dependencies**

Backend:
```bash
cd Backend
npm install
```

Frontend:
```bash
cd Frontend
npm install
```

4. **Start the Servers**

Backend:
```bash
npm start
```

Frontend:
```bash
npm run dev
```

## API Endpoints

### PayPal
- POST `/api/paypal/process`: Process PayPal payment
- POST `/api/paypal/capture`: Capture PayPal payment

### M-Pesa
- POST `/api/mpesa/initiate`: Initiate M-Pesa STK push
- POST `/api/mpesa/confirm`: Check payment status

### Airtel Money
- POST `/api/airtel/initiate`: Initiate Airtel Money payment
- POST `/api/airtel/confirm`: Check payment status

### Credit Card
- POST `/api/card/process`: Process card payment
- POST `/api/card/refund`: Process refund

## Transaction Flow

1. **User Initiates Payment**
   - Selects payment method
   - Enters amount and required details

2. **Frontend Validation**
   - Validates input format
   - Checks for required fields
   - Formats data for API

3. **Backend Processing**
   - Validates request
   - Initiates payment with provider
   - Handles provider response

4. **Status Monitoring**
   - Checks transaction status
   - Updates UI with progress
   - Handles success/failure

5. **Completion**
   - Shows success/failure message
   - Provides transaction reference
   - Option for new transaction

## Error Handling

- Input validation errors
- Network errors
- Provider-specific errors
- Transaction timeout handling
- Graceful degradation

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Payment provider accounts:
  - PayPal Developer Account
  - M-Pesa Developer Account
  - Airtel Money API Access

### Testing
```bash
# Run backend tests
cd Backend
npm test

# Run frontend tests
cd Frontend
npm test
```

## Production Deployment

1. Update environment variables for production
2. Build frontend:
```bash
cd Frontend
npm run build
```
3. Set up SSL certificates
4. Configure reverse proxy (e.g., Nginx)
5. Set up PM2 or similar process manager


## License

This project is licensed under the MIT License - see the LICENSE file for details.
