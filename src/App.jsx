import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { CartProvider } from './context/cartContext';
import Login from './pages/Login';
import Products from './components/Products';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import TestRazorpay from './components/TestRazorpay';


function App() {
  // get current url, and if its login then don't show navbar
  const [currentUrl, setCurrentUrl] = useState(window.location.pathname);
  return (
    <CartProvider>
      <Router>
        {currentUrl !== '/login' && <Navbar />}
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/test_razorpay" element={<TestRazorpay />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
