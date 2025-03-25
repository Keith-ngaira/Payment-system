import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { motion } from 'framer-motion';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PaymentForm from './components/PaymentForm';

function App() {
  return (
    <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <div className="min-h-screen bg-gradient-to-r from-primary-light via-secondary-light to-background p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Client Payment Portal
          </h1>
          <p className="text-gray-600 text-lg">
            Secure and Convenient Payment Processing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <PaymentForm />
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-light rounded-full mix-blend-multiply filter blur-xl animate-float" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary-light rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '1s' }} />
        </motion.div>
      </div>
    </PayPalScriptProvider>
  );
}

export default App;
