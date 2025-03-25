import { useState } from 'react';
import { motion } from 'framer-motion';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { mpesaService, airtelService, cardService } from '../services';
import {
  CreditCardIcon,
  PhoneIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const methods = [
    {
      id: 'card',
      name: 'Credit Card',
      icon: CreditCardIcon,
      types: ['Visa', 'Mastercard'],
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: PhoneIcon,
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      icon: PhoneIcon,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: CurrencyDollarIcon,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      switch (selectedMethod) {
        case 'mpesa':
          const mpesaResponse = await mpesaService.initiatePayment(phoneNumber, amount);
          if (mpesaResponse.success) {
            // Start polling for payment status
            const checkMpesaStatus = setInterval(async () => {
              const status = await mpesaService.checkPaymentStatus(mpesaResponse.checkoutRequestID);
              if (status.success) {
                clearInterval(checkMpesaStatus);
                setSuccess(true);
              }
            }, 5000);
            // Stop checking after 2 minutes
            setTimeout(() => clearInterval(checkMpesaStatus), 120000);
          }
          break;

        case 'airtel':
          const airtelResponse = await airtelService.initiatePayment(phoneNumber, amount);
          if (airtelResponse.success) {
            // Start polling for payment status
            const checkAirtelStatus = setInterval(async () => {
              const status = await airtelService.checkPaymentStatus(airtelResponse.transaction.id);
              if (status.success) {
                clearInterval(checkAirtelStatus);
                setSuccess(true);
              }
            }, 5000);
            // Stop checking after 2 minutes
            setTimeout(() => clearInterval(checkAirtelStatus), 120000);
          }
          break;

        case 'card':
          const validation = cardService.validateCard(cardDetails);
          if (!validation.isValid) {
            throw new Error(Object.values(validation.errors)[0]);
          }
          const cardResponse = await cardService.processPayment(cardDetails, amount);
          if (cardResponse.success) {
            setSuccess(true);
          }
          break;
      }
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const getMethodButtonClass = (methodId) => {
    return `flex items-center justify-center p-4 rounded-lg ${
      selectedMethod === methodId
        ? 'bg-primary text-white'
        : 'bg-background-accent text-gray-600 hover:bg-primary-light'
    } transition-colors duration-200`;
  };

  const getPayButtonClass = () => {
    return `w-full py-4 px-6 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium ${
      loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
    } transition-all duration-200`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg animate-glow"
    >
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Thank you for your payment.</p>
          <button
            onClick={() => {
              setSuccess(false);
              setSelectedMethod('');
              setAmount('');
              setPhoneNumber('');
              setCardDetails({ number: '', expiry: '', cvc: '', name: '' });
            }}
            className="mt-6 text-primary hover:text-primary-dark"
          >
            Make another payment
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Amount (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background-accent border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              {methods.map((method) => (
                <motion.button
                  key={method.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={getMethodButtonClass(method.id)}
                >
                  <method.icon className="h-6 w-6 mr-2" />
                  {method.name}
                </motion.button>
              ))}
            </div>
          </div>

          {(selectedMethod === 'mpesa' || selectedMethod === 'airtel') && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254XXXXXXXXX"
                className="w-full px-4 py-3 rounded-lg bg-background-accent border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-4 py-3 rounded-lg bg-background-accent border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiry: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-background-accent border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvc: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-background-accent border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-background-accent border border-primary-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>
          )}

          {selectedMethod === 'paypal' ? (
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: amount,
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(() => {
                  setSuccess(true);
                });
              }}
              onError={(err) => {
                setError('PayPal payment failed');
                console.error(err);
              }}
              style={{ layout: 'vertical' }}
            />
          ) : selectedMethod ? (
            <button
              type="submit"
              disabled={loading}
              className={getPayButtonClass()}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          ) : null}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center"
            >
              {error}
            </motion.div>
          )}
        </form>
      )}
    </motion.div>
  );
};

export default PaymentForm;
