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

  useEffect(() => {
    let id = localStorage.getItem("shopify_cart_id");
    if (!id) {
      createCart();
    } else {
      setCartId(id);
      fetchCart(id);
    }
  }, []);

  const createCart = async () => {
    setLoading(true);
    try {
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
      return newCart;
    } catch (error) {
      console.error("Error creating cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async (id) => {
    setLoading(true);
    try {
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
      setCart(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (variantId, quantity = 1) => {
    setLoading(true);
    try {
      if (!cartId) {
        const newCart = await createCart();
        return addToCart(variantId, quantity);
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
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (lineId) => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLineItem = async (lineId, quantity) => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error("Error updating line item:", error);
    } finally {
      setLoading(false);
    }
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