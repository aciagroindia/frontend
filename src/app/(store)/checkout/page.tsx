"use client";

import { useState, useEffect, Suspense } from "react";
import { useCart } from "../../../../context/CartContext";
import { useProducts } from "../../../../context/ProductContext";
import { useAuth } from "../../../../context/AuthContext";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";

// 1. Saara logic CheckoutContent naam ke function mein move kar diya
function CheckoutContent() {
  const { cartItems, cartTotal, fetchCart } = useCart();
  const { products: allProducts } = useProducts();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  // useSearchParams ab is child component ke andar hai
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buyNow";

  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  useEffect(() => {
    if (isBuyNow) {
      const storedItem = sessionStorage.getItem("buyNowItem");
      if (storedItem) {
        try {
          const item = JSON.parse(storedItem);
          setCheckoutItems([item]);
          setCheckoutTotal(item.price * item.quantity);
        } catch (error) {
          console.error("Failed to parse buyNow item", error);
        }
      }
    } else {
      setCheckoutItems(cartItems);
      setCheckoutTotal(cartTotal);
    }
  }, [isBuyNow, cartItems, cartTotal]);

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    postalCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to place an order.");
      router.push("/admin/login");
      return;
    }

    if (checkoutItems.length === 0) {
      toast.error("Nothing to checkout.");
      return;
    }

    try {
      setIsSubmitting(true);

      const items = checkoutItems.map((item) => {
        const fullProduct = allProducts.find((p: any) => p._id === item.productId);
        const image = fullProduct?.image || item.image || "/placeholder.png";
        const baseProductId = item.productId || item._id || item.id?.split('-')[0];

        return {
          name: item.name,
          qty: item.quantity,
          quantity: item.quantity,
          image: image,
          price: item.price,
          product: baseProductId,
          productId: baseProductId,
        };
      });

      const payload = {
        items,
        orderItems: items,
        shippingAddress,
        shippingInfo: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: shippingAddress.country,
          pinCode: shippingAddress.pinCode,
          postalCode: shippingAddress.postalCode,
          phoneNo: shippingAddress.phone,
        },
        clearCart: !isBuyNow,
      };

      const response = await axiosInstance.post("/orders", payload);

      if (response.data.success) {
        toast.success("Order placed successfully!");

        if (isBuyNow) {
          sessionStorage.removeItem("buyNowItem");
        } else {
          await fetchCart();
        }

        router.push("/orders");
      }
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error.response?.data?.message || "Failed to place the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", minHeight: "50vh" }}>
        <h2>Authentication Required</h2>
        <p style={{ margin: "1rem 0" }}>You must be logged in to proceed with checkout.</p>
        <button
          onClick={() => router.push("/admin/login")}
          style={{ padding: "0.5rem 1rem", background: "#1a8e5f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Login Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 600px" }}>
        <h1>Checkout {isBuyNow && <span style={{ fontSize: "1rem", color: "#1a8e5f", marginLeft: "1rem" }}>(Buy Now Mode)</span>}</h1>

        <form onSubmit={handlePlaceOrder} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <h2>Shipping Address</h2>

          <input type="text" name="name" placeholder="Full Name" value={shippingAddress.name} onChange={handleInputChange} required style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />

          <input type="text" name="phone" placeholder="Phone Number" value={shippingAddress.phone} onChange={handleInputChange} required style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />

          <input type="text" name="address" placeholder="Street Address" value={shippingAddress.address} onChange={handleInputChange} required style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />

          <div style={{ display: "flex", gap: "1rem" }}>
            <input type="text" name="city" placeholder="City" value={shippingAddress.city} onChange={handleInputChange} required style={{ flex: 1, padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
            <input type="text" name="pinCode" placeholder="Pin Code" value={shippingAddress.pinCode} onChange={handleInputChange} required style={{ flex: 1, padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <input type="text" name="postalCode" placeholder="Postal Code" value={shippingAddress.postalCode} onChange={handleInputChange} required style={{ flex: 1, padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
            <input type="text" name="state" placeholder="State" value={shippingAddress.state} onChange={handleInputChange} required style={{ flex: 1, padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
          </div>

          <input type="text" name="country" placeholder="Country" value={shippingAddress.country} onChange={handleInputChange} required style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />

          <button type="submit" disabled={isSubmitting || checkoutItems.length === 0} style={{ marginTop: '1rem', padding: "1rem", background: "#1a8e5f", color: "white", border: "none", borderRadius: "4px", cursor: isSubmitting ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "1.1rem" }}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>

      <div style={{ flex: "1 1 400px", background: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", height: "fit-content" }}>
        <h2>Order Summary</h2>
        {checkoutItems.length === 0 ? <p>Nothing to checkout.</p> : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {checkoutItems.map((item, idx) => {
                const fullProduct = allProducts.find((p: any) => p._id === item.productId);
                const image = fullProduct?.image || item.image;

                return (
                  <li key={idx} style={{ display: "flex", marginBottom: "1rem" }}>
                    <div style={{ width: 60, height: 60, position: "relative" }}>
                      <Image src={image || "/placeholder.png"} alt={item.name} fill style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ marginLeft: "1rem", flex: 1 }}>
                      <strong>{item.name}</strong>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div>Rs. {(item.price * item.quantity).toFixed(2)}</div>
                  </li>
                );
              })}
            </ul>

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <span>Total:</span>
              <span>Rs. {checkoutTotal.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 2. Main Page Component jo Suspense provide karta hai
export default function CheckoutPage() {
  return (
    // Suspense add kiya gaya hai jisse build error fix ho jayega
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}