import React from 'react';
import { useState } from 'react';
import { useCart } from '../context/cartContext';

const Navbar = () => {

  const { cart } = useCart();
  const cartItems = cart?.lines?.edges || [];
  const cartQuantity = cartItems.reduce((total, item) => total + item.node.quantity, 0);
  const [cartCount, setCartCount] = useState(cartQuantity);

  // Update cart count when cart changes
  React.useEffect(() => {
    setCartCount(cartQuantity);
  }, [cartQuantity]);
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">MyShop</div>
        <ul className="flex space-x-4">
          <li>
            <a href="/test_razorpay" className="text-white hover:text-gray-300">Test Razorpay</a>
          </li>
          <li>
            <a href="/products" className="text-white hover:text-gray-300">Products</a>
          </li>
          <li>
            <a href="/cart" className="text-white hover:text-gray-300">Cart{ cartCount > 0 && <span className="ml-1 bg-red-500 text-white rounded-full px-2">{cartCount}</span>}</a>
          </li>
          <li>
            <a onClick={
                () => {
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            } className="text-white hover:text-gray-300">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar