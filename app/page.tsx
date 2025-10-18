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
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [cashGiven, setCashGiven] = useState("");
  const [change, setChange] = useState<number | null>(null);
  const [error, setError] = useState("");

  const addToCart = (product: Product) => {
    resetPaymentState();
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

  const removeFromCart = (productId: number) => {
    resetPaymentState();
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
    resetPaymentState();
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== id));
  };

  const addProduct = () => {
    resetPaymentState();
    const price = parseFloat(newProductPrice);
    if (!newProductName || isNaN(price) || price <= 0) return;

    const newProduct: Product = {
      id: Date.now(),
      name: newProductName,
      price: price,
    };

    setProducts((prev) => [...prev, newProduct]);
    setNewProductName("");
    setNewProductPrice("");
  };

  const handleBuy = () => {
    const totalNum = parseFloat(total);
    const cash = parseFloat(cashGiven);

    if (isNaN(cash)) {
      setError("Please enter a valid cash amount.");
      return;
    }

    if (cash < totalNum) {
      setError(`Insufficient cash. You need $${(totalNum - cash).toFixed(2)} more.`);
      return;
    }

    setChange(cash - totalNum);
    setPaymentComplete(true);
    setError("");
    setCart([]);
    setCashGiven("");
  };

  const resetPaymentState = () => {
    setPaymentComplete(false);
    setChange(null);
    setError("");
  };

  const total = cart
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          🛒 Simple POS System
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Products</h2>

            <ul className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded border border-gray-200 hover:shadow transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full font-bold">
                      {product.name[0].toUpperCase()}
                    </div>
                    <span className="text-gray-800">
                      {product.name} –{" "}
                      <span className="font-medium text-blue-600">${product.price.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Add New Product */}
            <div className="pt-4 border-t text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Product</h3>
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full md:w-1/3 px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="w-full md:w-1/3 px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addProduct}
                  className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Cart</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 italic text-center">🛒 Your cart is empty. Add some products!</p>
            ) : (
              <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cart.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded border hover:shadow transition-shadow"
                  >
                    <span className="text-gray-800">
                      {item.product.name} × {item.quantity} –{" "}
                      <span className="font-medium text-green-600">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Total and Payment */}
            <div className="mt-6 border-t pt-4 text-right space-y-4">
              <p className="text-lg font-semibold text-gray-800">
                Total: <span className="text-green-600">${total}</span>
              </p>

              <div className="flex justify-end items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Cash Given:</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  placeholder="0.00"
                  className="w-28 px-2 py-1 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleBuy}
                disabled={cart.length === 0}
                className={`w-full px-4 py-2 rounded-md text-white font-medium transition ${cart.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                Buy
              </button>

              {/* Messages */}
              {error && (
                <div className="px-4 py-2 bg-red-100 text-red-700 rounded-md border border-red-300">
                  ❌ {error}
                </div>
              )}
              {paymentComplete && (
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-md border border-green-300">
                  ✅ Payment successful! Change due: <strong>${change?.toFixed(2)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
