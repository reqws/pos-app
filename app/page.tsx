'use client';

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

export default function POS() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Apple", price: 1 },
    { id: 2, name: "Banana", price: 0.5 },
    { id: 3, name: "Orange", price: 0.8 },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  // Add product to cart or increase quantity if it exists
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // Decrease quantity or remove from cart if quantity is 1
  const removeFromCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== id));
  };

  const addProduct = () => {
    const price = parseFloat(newProductPrice);
    if (!newProductName || isNaN(price)) return;

    const newProduct: Product = {
      id: Date.now(),
      name: newProductName,
      price: price,
    };

    setProducts((prev) => [...prev, newProduct]);
    setNewProductName("");
    setNewProductPrice("");
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          🛒 Simple POS System
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Products
            </h2>

            <ul className="space-y-4 mb-6">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded border hover:shadow transition-shadow"
                >
                  <span className="text-gray-800">
                    {product.name} –{" "}
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Add New Product Form */}
            <div className="pt-4 border-t text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Product</h3>

              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full md:w-1/3 px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="w-full md:w-1/3 px-3 py-2 border rounded-md"
                />
                <button
                  onClick={addProduct}
                  className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Cart
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 italic">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded border hover:shadow transition-shadow"
                  >
                    <span className="text-gray-800">
                      {item.product.name} × {item.quantity} –{" "}
                      <span className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 border-t pt-4 text-right">
              <p className="text-lg font-semibold text-gray-800">
                Total: <span className="text-green-600">${total}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
