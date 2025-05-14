import { useState, useEffect } from 'react';
import {useCart} from '../context/cartContext'; 
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {

    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();

    const addToCartFromButton = async (variantId) => {
        setLoading(true);
        try {
            await addToCart(variantId);
            // alert('Product added to cart'); // use toast instead
        } catch (error) {
            console.error('Error adding product to cart:', error);
            // alert('Error adding product to cart');
            toast.error('Error adding product to cart');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="product-card bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
            {/* // Product image on center */}
            <div className="flex justify-center mb-4">
                {product?.images?.edges?.[0]?.node?.src && (
                    <img
                        src={product.images.edges[0].node.src}
                        alt={product.images.edges[0].node.altText}
                        className="w-32 h-32 object-cover rounded-md"
                    />
                )}
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            <p className="text-gray-800 font-medium mb-2">
                Price: {product.priceRange.minVariantPrice.amount}
            </p>
            <p className={`text-sm mb-4 ${product.availableForSale ? 'text-green-600' : 'text-red-600'}`}>
                Available: {product.availableForSale ? 'Yes' : 'No'}
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => addToCartFromButton(product.variants.edges[0].node.id)}
                disabled={loading || !product.availableForSale}
            >
                Add to Cart
            </button>
        </div>
    );
}

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
    const MAX_ITEMS_PER_PAGE = 3;

    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = '/login';
    }

    const myshopifyDomain = import.meta.env.VITE_SHOPIFY_STOREFRONT_DOMAIN;
    const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const query = `{
        products(first: 10) {
            edges {
                node {
                    id
                    title
                    description
                    descriptionHtml
                    handle
                    productType
                    tags
                    vendor
                    availableForSale
                    createdAt
                    updatedAt
                    publishedAt
                    onlineStoreUrl
                    images(first: 5) {
                        edges {
                            node {
                                id
                                src
                                altText
                            }
                        }
                    }
                    priceRange {
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    variants(first: 5) {
                        edges {
                            node {
                                id
                                title
                                sku
                                availableForSale
                                price {
                                    amount
                                    currencyCode
                                }
                                selectedOptions {
                                    name
                                    value
                                }
                                image {
                                    src
                                }
                            }
                        }
                    }
                }
            }
        }
    }`;

    // Fetch products from Shopify Storefront API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`https://${myshopifyDomain}/api/2023-10/graphql.json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
                    },
                    body: JSON.stringify({ query }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`); 
                }
                const data = await response.json();
                console.log('Fetched products:', data);
                setProducts(data.data.products);
                setLoading(false);

                setTotalCount(data.data.products.edges.length);
                setPage(1);
            }
            catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Error fetching products');
                setError(error);
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // const handlePageChange = (newPage) => {
    //     setPage(newPage);
    //     const start = (newPage - 1) * MAX_ITEMS_PER_PAGE;
    //     const end = start + MAX_ITEMS_PER_PAGE;
    //     setPaginatedProducts(products.edges.slice(start, end));
    //     setHasNextPage(end < totalCount);
    //     setHasPreviousPage(start > 0);
    // }
    // const handleNextPage = () => {
    //     if (hasNextPage) {
    //         handlePageChange(page + 1);
    //     }
    // }
    // const handlePreviousPage = () => {
    //     if (hasPreviousPage) {
    //         handlePageChange(page - 1);
    //     }
    // }
    // const handlePageNumberClick = (pageNumber) => {
    //     handlePageChange(pageNumber);
    // }
return (
    <div className="products-container p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>
        {/* toggle button for available products */}
        <div className="flex items-center mb-4">
            <input
                type="checkbox"
                id="showOnlyAvailable"
                checked={showOnlyAvailable}
                onChange={(e) => {
                    setShowOnlyAvailable(e.target.checked)
                    setPage(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTotalCount(e.target.checked ? products.edges.filter(product => product.node.availableForSale).length : products.edges.length);
                }}
                className="mr-2"
            />
            <label htmlFor="showOnlyAvailable" className="text-gray-700">Show only available products</label>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!showOnlyAvailable && products.edges.slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE).map((product) => (
                (!showOnlyAvailable || product.node.availableForSale) && (
                    <li key={product.node.id} className="mb-4">
                        <ProductCard product={product.node} />
                    </li>
                )
            ))}
            {showOnlyAvailable && products.edges.filter(product => product.node.availableForSale).slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE).map((product) => (
                <li key={product.node.id} className="mb-4">
                    <ProductCard product={product.node} />
                </li>
            ))}
        </ul>
        <div className="pagination-controls flex justify-between mt-6">
            <button
                onClick={() => {
                    setPage((prev) => Math.max(prev - 1, 1))
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md ${page!=1 ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
                Previous
            </button>
            <span className="text-gray-700">
                Page {page} of {Math.ceil(totalCount / MAX_ITEMS_PER_PAGE)}
            </span>
            <button
                onClick={() => {
                    setPage((prev) => prev + 1)
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page * MAX_ITEMS_PER_PAGE >= totalCount}
                className={`px-4 py-2 rounded-md ${page * MAX_ITEMS_PER_PAGE < totalCount ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
                Next
            </button>
        </div>
    </div>
)
}

export default Products