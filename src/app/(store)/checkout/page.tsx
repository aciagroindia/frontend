"use client";

import { useState, useEffect, Suspense } from "react";
import { useCart } from "../../../../context/CartContext";
import { useProducts } from "../../../../context/ProductContext";
import { useAuth } from "../../../../context/AuthContext";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-hot-toast";

function CheckoutContent() {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const { cartItems, cartTotal, fetchCart } = useCart();
  const { products: allProducts } = useProducts();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buyNow";

  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  // FIX: Naya state add kiya hai Payment Method ke liye
  const [paymentMethod, setPaymentMethod] = useState("Razorpay"); 

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

  useEffect(() => {
      if(user) {
          setShippingAddress(prev => ({...prev, name: user.name || prev.name}))
      }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      // Agar Razorpay select kiya hai, toh pehle script load karo
      if (paymentMethod === 'Razorpay') {
        const resScript = await loadRazorpayScript();
        if (!resScript) {
          toast.error("Razorpay SDK failed to load. Check your internet connection.");
          setIsSubmitting(false);
          return;
        }
      }

      if (!isAuthenticated) {
        toast.error("Please log in to proceed to payment.");
        router.push("/login"); 
        return;
      }

      if (checkoutItems.length === 0) {
        toast.error("Your cart is empty. Nothing to checkout.");
        return;
      }

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
          phoneNo: shippingAddress.phone,
        },
        paymentMethod: paymentMethod, // FIX: Dynamic payment method bhej rahe hain backend ko
      };

      const response = await axiosInstance.post("/orders", payload);
      
      if (response.data.success) {
        const orderData = response.data.data;

        // FIX: Agar COD hai, toh seedha order success kar do bina Razorpay ke
        if (paymentMethod === 'COD') {
          toast.success("Order Placed Successfully!");
          if (isBuyNow) sessionStorage.removeItem("buyNowItem");
          else await fetchCart();
          router.push("/orders");
          return;
        }

        // Agar COD nahi hai, toh Razorpay open karo
        const rzpOrderId = response.data.razorpayOrderId;
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.totalAmount * 100, // Amount in paisa
          currency: "INR",
          name: "Aciagro",
          description: "Secure Payment",
          order_id: rzpOrderId,
          handler: async function (rzpResponse: any) {
            try {
              const verifyRes = await axiosInstance.post("/orders/pay", {
                orderId: orderData._id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_signature: rzpResponse.razorpay_signature,
                clearCart: !isBuyNow,
              });
              
              if (verifyRes.data.success) {
                toast.success("Payment successful! Order Placed.");
                if (isBuyNow) sessionStorage.removeItem("buyNowItem");
                else await fetchCart();
                router.push("/orders");
              }
            } catch (verifyError) {
              console.error("Payment verification failed:", verifyError);
              toast.error("Payment verification failed at server!");
            }
          },
          prefill: {
            name: shippingAddress.name,
            contact: shippingAddress.phone,
          },
          theme: { color: "#1a8e5f" },
        };
        
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          console.error("Razorpay Payment Failed:", response);
          toast.error("Payment Failed. Order saved as pending.");
          router.push("/orders");
        });
        rzp.open();
      } else {
        toast.error(response.data.message || "Failed to create order.");
      }
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast.error(error.response?.data?.message || "Failed to initiate payment.");
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
          onClick={() => router.push("/login")}
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

          {/* FIX: Payment Method Selection */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #eaeaea', borderRadius: '8px', background: '#fcfcfc' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Payment Method</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: '1rem' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === "Razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ cursor: "pointer", width: "18px", height: "18px" }}
                />
                💳 Pay Online (Cards / UPI / NetBanking)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: '1rem' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ cursor: "pointer", width: "18px", height: "18px" }}
                />
                💵 Cash on Delivery (COD)
              </label>
            </div>
          </div>

          {/* FIX: Dynamic Button Text based on Payment Method */}
          <button type="submit" disabled={isSubmitting || checkoutItems.length === 0} style={{ marginTop: '1rem', padding: "1rem", background: "#1a8e5f", color: "white", border: "none", borderRadius: "4px", cursor: isSubmitting ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "1.1rem" }}>
            {isSubmitting 
              ? "Processing..." 
              : paymentMethod === "COD" 
                ? "Place Order (COD)" 
                : "Proceed to Payment"}
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

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.1rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
              <span>Total:</span>
              <span>Rs. {checkoutTotal.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}