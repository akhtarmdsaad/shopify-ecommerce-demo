import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { CartProvider } from './context/cartContext';
import Login from './components/Login';
import Products from './components/Products';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import TestRazorpay from './components/TestRazorpay';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mock authentication function
const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  return localStorage.getItem('user') !== null;
};

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <CartProvider>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test_razorpay"
            element={
              <ProtectedRoute>
                <TestRazorpay />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </CartProvider>
  );
}

export default App;
