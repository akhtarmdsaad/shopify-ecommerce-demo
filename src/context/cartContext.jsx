import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STOREFRONT_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;

const headers = {
  "Content-Type": "application/json",
  "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
};

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔁 Rehydrate cart from localStorage
  useEffect(() => {
    let id = localStorage.getItem("shopify_cart_id");
    if (!id) {
        createCart();
    }
    else {
        setCartId(id);
        fetchCart(id);
    }
  }, []);

  // 🧱 Create a cart
  const createCart = async () => {
    setLoading(true);
    const mutation = `
      mutation {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
        }
      }
    `;
    const res = await axios.post(API_URL, { query: mutation }, { headers });
    const newCart = res.data.data.cartCreate.cart;
    setCartId(newCart.id);
    setCart(newCart);
    localStorage.setItem("shopify_cart_id", newCart.id);
    setLoading(false);
    return newCart;
  };

  // 🛒 Fetch current cart
  const fetchCart = async (id) => {
    setLoading(true);
    const query = `
      query {
        cart(id: "${id}") {
          id
          checkoutUrl
          totalQuantity
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            id
                            src
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const res = await axios.post(API_URL, { query }, { headers });
    console.log("Fetched cart:", res.data);
    if (res.data.errors) {
      console.error("Error fetching cart:", res.data.errors);
      return;
    }
    const cart = res.data.data.cart;
    if (!cart) {
      console.error("Cart not found. Creating a new cart.");
      const newCart = await createCart();
      return newCart;
    }
    setCartId(cart.id);
    localStorage.setItem("shopify_cart_id", cart.id);
    setCart(res.data.data.cart);
    setLoading(false);
  };

  // ➕ Add item
  const addToCart = async (variantId, quantity = 1) => {
    setLoading(true);
    if (!cartId) {
      const newCart = await createCart();
      return addToCart(variantId, quantity); // re-run after cart creation
    }

    const mutation = `
      mutation {
        cartLinesAdd(cartId: "${cartId}", lines: [{
          merchandiseId: "${variantId}",
          quantity: ${quantity}
        }]) {
          cart {
            id
            totalQuantity
            checkoutUrl
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const res = await axios.post(API_URL, { query: mutation }, { headers });
    setCart(res.data.data.cartLinesAdd.cart);
    setLoading(false);
  };

  // 🗑 Remove item
  const removeFromCart = async (lineId) => {
    const mutation = `
      mutation {
        cartLinesRemove(cartId: "${cartId}", lineIds: ["${lineId}"]) {
          cart {
            id
            totalQuantity
            checkoutUrl
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            id
                            src
                            altText
                          }
                        }
                      }
                    }
                  }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const res = await axios.post(API_URL, { query: mutation }, { headers });
    setCart(res.data.data.cartLinesRemove.cart);
  };

  // 🛒 Update item quantity
  const updateLineItem = async (lineId, quantity) => {
    const mutation = `
      mutation {
        cartLinesUpdate(cartId: "${cartId}", lines: [{
          id: "${lineId}",
          quantity: ${quantity}
        }]) {
          cart {
            id
            totalQuantity
            checkoutUrl
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            id
                            src
                            altText
                          }
                        }
                      }
                    }
                  }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const res = await axios.post(API_URL, { query: mutation }, { headers });
    if (res.data.errors) {
      console.error("Error updating line item:", res.data.errors);
      return;
    }
    setCart(res.data.data.cartLinesUpdate.cart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        createCart,
        fetchCart,
        addToCart,
        removeFromCart,
        updateLineItem,
        loading,
        checkoutUrl: cart?.checkoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);