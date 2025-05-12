import React from 'react';
import { useCart } from '../context/cartContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';

// Shopify GraphQL Configuration
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STOREFRONT_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;



const CartItem = ({ item, onRemove, onUpdate }) => {
    // Format price with currency
    const formatPrice = (amount, currency) => {
        const formattedAmount = parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return `${formattedAmount} ${currency.toUpperCase()}`;
    };

    return (
        <li className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center space-x-4">
                {/* Product Image */}
                <img
                    src={item?.node?.merchandise?.product?.images?.edges?.[0]?.node?.src} 
                    alt={item?.node?.merchandise?.product?.images?.edges?.[0]?.node?.altText || 'Product Image'}
                    className="w-20 h-20 object-cover rounded-md shadow-sm"
                />
                
                {/* Product Details */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {item?.node?.merchandise?.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Price: {formatPrice(
                            item?.node?.merchandise?.priceV2?.amount, 
                            item?.node?.merchandise?.priceV2?.currencyCode
                        )}
                    </p>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center mt-2">
                        <label htmlFor={`quantity-${item.node.id}`} className="mr-2 text-gray-600 dark:text-gray-400">
                            Quantity:
                        </label>
                        <input
                            id={`quantity-${item.node.id}`}
                            type="number"
                            value={item.node.quantity}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value > 0) {
                                    onUpdate(item.node.id, value);
                                }
                            }}
                            className="w-20 px-2 py-1 border rounded-md 
                                text-gray-700 dark:text-gray-200
                                bg-white dark:bg-gray-800
                                border-gray-300 dark:border-gray-600
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            min="1"
                        />
                    </div>
                </div>
            </div>
            
            {/* Remove Button */}
            <button
                onClick={() => onRemove(item.node.id)}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500
                    bg-red-50 dark:bg-red-950 
                    p-2 rounded-full 
                    transition-colors duration-200 
                    flex items-center justify-center
                    hover:bg-red-100 dark:hover:bg-red-900"
                aria-label="Remove item"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </li>
    );
};

const Cart = () => {
    const { cart, loading, removeFromCart, updateLineItem } = useCart();
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // Update cart items when cart changes
    useEffect(() => {
        if (cart?.lines?.edges) {
            setCartItems(cart.lines.edges);
        }
    }, [cart]);

    // Calculate total cart value
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.node.merchandise.priceV2.amount);
            const quantity = item.node.quantity;
            return total + (price * quantity);
        }, 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    // Handle item removal
    const handleRemoveItem = async (lineId) => {
        await removeFromCart(lineId);
    };

    // Handle quantity update
    const handleUpdateQuantity = async (lineId, quantity) => {
        await updateLineItem(lineId, quantity);
    };

    return (
        <div className="container mx-auto px-4 py-8 
            bg-white dark:bg-gray-900 
            text-gray-900 dark:text-gray-100 
            min-h-screen transition-colors duration-200">
            <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800 
                shadow-lg dark:shadow-xl rounded-xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold 
                        text-gray-800 dark:text-gray-200 
                        flex items-center">
                        <ShoppingBag className="mr-3 w-8 h-8" />
                        Shopping Cart
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                            Loading cart items...
                        </p>
                    </div>
                ) : (
                    <>
                        {cartItems.length > 0 ? (
                            <>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {cartItems.map((item) => (
                                        <CartItem
                                            key={item.node.id}
                                            item={item}
                                            onRemove={handleRemoveItem}
                                            onUpdate={handleUpdateQuantity}
                                        />
                                    ))}
                                </ul>

                                {/* Total and Checkout Section */}
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-semibold 
                                            text-gray-800 dark:text-gray-200">
                                            Total:
                                        </span>
                                        <span className="text-2xl font-bold 
                                            text-gray-900 dark:text-gray-100">
                                            {calculateTotal()} INR
                                        </span>
                                    </div>

                                    <div className="mt-6 flex space-x-4">
                                        <button
                                            onClick={() => navigate('/products')}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 
                                                dark:bg-blue-600 dark:hover:bg-blue-700
                                                text-white font-semibold py-3 rounded-lg 
                                                transition-colors duration-200 
                                                flex items-center justify-center"
                                        >
                                            Continue Shopping
                                        </button>
                                        <button
                                            className="flex-1 bg-green-500 hover:bg-green-600 
                                                dark:bg-green-600 dark:hover:bg-green-700
                                                text-white font-semibold py-3 rounded-lg 
                                                transition-colors duration-200 
                                                flex items-center justify-center"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 
                                bg-gray-100 dark:bg-gray-700 
                                rounded-lg">
                                <ShoppingBag className="mx-auto mb-4 w-16 h-16 
                                    text-gray-400 dark:text-gray-500" />
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    Your cart is empty
                                </p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 
                                        dark:bg-blue-600 dark:hover:bg-blue-700
                                        text-white font-semibold px-6 py-3 rounded-lg 
                                        transition-colors duration-200"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;