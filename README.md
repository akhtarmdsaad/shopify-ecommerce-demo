# Shopify Ecommerce Demo

## Overview

This project is a demonstration of a modern ecommerce storefront built using React, Vite, and Tailwind CSS, integrated with the Shopify Storefront API. It showcases key functionalities such as product browsing, cart management, and secure payment processing using Razorpay. This project is designed for educational and demonstrative purposes and aims to highlight best practices in frontend development and ecommerce integration.

## Features

*   **Product Catalog:** Browse products fetched directly from a Shopify store.
*   **Shopping Cart:** Add, remove, and update product quantities in a persistent shopping cart.
*   **Secure Checkout:** Integrated with Razorpay for secure payment processing (demonstration purposes).
*   **Cart Management with Shopify Storefront API**: Utilizes Shopify's GraphQL-based Storefront API for creating carts, adding products, and managing cart items.
*   **State management with Context API**: Using React's Context API to manage cart state and provide access to cart functionalities across the application.
*   **Notification system with react-toastify**: Displaying success and error messages using react-toastify library to enhance user experience.
*   **Payment Integration using Razorpay**: Implemented Razorpay payment gateway for seamless payment transactions.
*   **Protected Routes**: Implemented protected routes to ensure only authenticated users can access certain parts of the application.
*   **Pagination**: implemented pagination for better user experience.

## Technologies Used

*   **Frontend:**
    *   React: JavaScript library for building user interfaces
    *   Vite:  Next Generation Frontend Tooling
    *   Tailwind CSS: Utility-first CSS framework
    *   React Router: For navigation and routing
    *   Axios: For making HTTP requests to the Shopify Storefront API and backend
    *   lucide-react: Beautifully simple, pixel-perfect icons
    *   react-toastify: Notification system
*   **Payment Gateway:**
    *   Razorpay: Payment gateway integration for secure transactions.
*   **Backend:**
    *   Node.js (Express): For handling Razorpay payment verification

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akhtarmdsaad/shopify-ecommerce-demo
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    *   Create a `.env` file (or update the appropriate environment variables in your hosting environment).  You'll need to obtain the following from your Shopify store and Razorpay:

        *   `VITE_SHOPIFY_STOREFRONT_DOMAIN`: Your Shopify store's domain (e.g., `your-store.myshopify.com`).
        *   `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`:  A Storefront API access token with the necessary permissions.
        *   `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID.
        *   `VITE_BACKEND_URL`: URL for the backend server (where payment verification happens). Default: `http://localhost:4000`

    **Example `.env`:**

    ```
    VITE_SHOPIFY_STOREFRONT_DOMAIN=your-store.myshopify.com
    VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    VITE_BACKEND_URL=http://localhost:4000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    This will start the application at `http://localhost:5173` (or a similar address).

## Shopify Store Access

When accessing the Shopify store through the storefront URL (especially the checkout page), you may be prompted for a password.  **The password for this demo store is `saad`**. This is a standard Shopify storefront protection mechanism.

## Bogus Payment Gateway (Shopify Testing)

Shopify provides a way to simulate successful or failed transactions using a bogus payment gateway during development.
Here's how you can use the bogus gateway for testing:

*   **Email Address:** You *must* use an email address that contains `@example.com` (e.g., `test@example.com`).
*   **Credit Card Number:** Use the following card numbers to simulate specific outcomes:
    *   `1`:  Successful transaction
    *   `2`:  Failed transaction
*   **Other Fields:** All other fields (name, expiry date, CVV) can be filled with any random values.
*   **Important Note:** This bogus payment gateway is *only available in development/test environments*.  It should *never* be used in a production store.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   ├── context/          # React context for managing global state (e.g., cart)
│   ├── utils/            # Utility functions (API calls, data formatting, etc.)
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/            # Static assets
├── vite.config.js    # Vite configuration
├── package.json       # Project dependencies
└── README.md         # This file
```

## Potential Improvements

*   **Enhanced Security:** Security can be significantly improved by implementing proper input validation and output sanitization to prevent common web vulnerabilities such as Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF). Additionally, the Shopify storefront access token should never be exposed on the frontend. All interactions with the Shopify API must be routed through a secure backend server to prevent unauthorized access and data leakage.
*   **Advanced Filtering/Sorting:** Implement more sophisticated filtering and sorting options for the product catalog.
*   **Product Reviews/Ratings:** Integrate a system for displaying product reviews and ratings.
*   **Wishlist Functionality:** Add a wishlist feature for users to save products for later.
*   **Backend Integration:** Implement robust backend APIs for handling user authentication, order management, and other server-side logic.
*   **SEO Optimization:**  Optimize the application for search engines.
*   **Accessibility Improvements:** Adhere to accessibility best practices to ensure the application is usable by everyone.

## Acknowledgments

*   This project was built using the Shopify Storefront API and Razorpay Payment gateway.
*   Thank you to the React, Vite, and Tailwind CSS communities for providing excellent tools and resources.

**Prepared by:** Md Saad Akhtar
