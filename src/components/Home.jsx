import React from 'react'

const Home = () => {
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to <br />the Home Page</h1>
            <p className="text-lg text-gray-600 mb-6">This is a simple home page component.</p>
            <div className="flex space-x-4">
                    <a href="/products" className="text-blue-500 hover:underline">
                            Go to Products
                    </a>
                    <a href="/cart" className="text-blue-500 hover:underline">
                            Go to Cart
                    </a>
                    <a href="/test_razorpay" className="text-blue-500 hover:underline">
                            Test Razorpay
                    </a>
            </div>
    </div>
)
}

export default Home