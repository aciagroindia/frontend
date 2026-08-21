"use client";

import { useState, useEffect, Suspense } from "react";
import { useCart } from "../../../../context/CartContext";
import { useProducts } from "../../../../context/ProductContext";
import { useAuth } from "../../../../context/AuthContext";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { fetchAvailableCoupons } from "../../../../lib/couponApi";
import { toast } from "react-hot-toast";

function CheckoutContent() {
  const { cartItems, cartTotal, fetchCart } = useCart();
  const { products: allProducts } = useProducts();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buyNow";

  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [discountInfo, setDiscountInfo] = useState<{
    subtotal: number;
    discountAmount: number;
    finalTotal: number;
    appliedDiscount: any;
  } | null>(null);

  // Available & Applied Coupons
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    couponId: string;
    code: string;
    discountAmount: number;
  } | null>(null);

  // Payment Method selection: default is PayU (Online)
  const [paymentMethod, setPaymentMethod] = useState("PayU"); 

  const loadBoltScript = (src: string) => {
    return new Promise((resolve) => {
      if ((window as any).bolt) {
        resolve(true);
        return;
      }
      const existingScript = document.getElementById("payu-bolt-script");
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement("script");
      script.id = "payu-bolt-script";
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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

  // Load available coupons for customer
  useEffect(() => {
    if (isAuthenticated) {
      fetchAvailableCoupons()
        .then((data) => setAvailableCoupons(data || []))
        .catch((err) => console.error("Error fetching available coupons:", err));
    }
  }, [isAuthenticated]);

  // Preview Automatic Discounts (Coupon only included if explicitly applied by user)
  useEffect(() => {
    const fetchDiscountPreview = async () => {
      if (checkoutItems.length === 0 || !isAuthenticated) return;
      try {
        const formattedItems = checkoutItems.map(item => {
          const baseProductId = item.productId || item._id || item.id?.split('-')[0];
          return {
            productId: baseProductId,
            price: item.price,
            quantity: item.quantity,
          };
        });

        const res = await axiosInstance.post("/orders/preview-discount", {
          items: formattedItems,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        });
        if (res.data.success) {
          setDiscountInfo(res.data.data);
          if (appliedCoupon && res.data.data.appliedCoupon && !res.data.data.appliedCoupon.error) {
            setAppliedCoupon(res.data.data.appliedCoupon);
          }
        }
      } catch (err) {
        console.error("Error calculating discount preview:", err);
      }
    };

    fetchDiscountPreview();
  }, [checkoutItems, isAuthenticated, appliedCoupon?.code]);

  // Explicit Coupon Application
  const handleApplyCouponCode = async (codeToApply: string) => {
    if (!codeToApply || !codeToApply.trim()) {
      toast.error("Please enter a valid coupon code.");
      return;
    }
    try {
      const formattedItems = checkoutItems.map(item => ({
        productId: item.productId || item._id || item.id?.split('-')[0],
        price: item.price,
        quantity: item.quantity,
      }));
      const res = await axiosInstance.post("/coupons/apply", {
        code: codeToApply.trim().toUpperCase(),
        items: formattedItems,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        setCouponInput(codeToApply.toUpperCase());
        toast.success(res.data.message || `Coupon ${codeToApply.toUpperCase()} applied!`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Unable to apply coupon.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.success("Coupon removed.");
  };

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
    if (user) {
      setShippingAddress(prev => ({ ...prev, name: user.name || prev.name }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

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
        shippingAddress: {
          ...shippingAddress,
          postalCode: shippingAddress.postalCode || shippingAddress.pinCode,
          pinCode: shippingAddress.pinCode || shippingAddress.postalCode,
        },
        shippingInfo: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: shippingAddress.country,
          pinCode: shippingAddress.pinCode || shippingAddress.postalCode,
          phoneNo: shippingAddress.phone,
        },
        paymentMethod: paymentMethod,
        isBuyNow: isBuyNow,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      };

      const response = await axiosInstance.post("/orders", payload);
      
      if (response.data.success) {
        // 1. CASH ON DELIVERY FLOW
        if (paymentMethod === 'COD') {
          toast.success("Order Placed Successfully!");
          if (isBuyNow) sessionStorage.removeItem("buyNowItem");
          else await fetchCart();
          router.push("/orders");
          return;
        }

        // 2. PAYU POPUP / OVERLAY (BOLT) CHECKOUT FLOW
        if (response.data.payu) {
          const { actionUrl, boltScriptUrl, params } = response.data.payu;
          const orderData = response.data.data;

          toast.loading("Opening secure PayU checkout...", { id: "payu-launch" });

          const scriptLoaded = await loadBoltScript(boltScriptUrl || "https://jssdk.payu.in/bolt/bolt.min.js");

          if (scriptLoaded && (window as any).bolt) {
            toast.dismiss("payu-launch");
            (window as any).bolt.launch(params, {
              responseHandler: async function (BOLT: any) {
                console.log("PayU Bolt response:", BOLT.response);
                if (BOLT.response.txnStatus === "SUCCESS") {
                  try {
                    const verifyRes = await axiosInstance.post("/orders/payu-verify", BOLT.response);
                    if (verifyRes.data.success) {
                      toast.success("Payment successful! Order Confirmed.");
                      if (isBuyNow) sessionStorage.removeItem("buyNowItem");
                      else await fetchCart();
                      router.push(`/orders?status=success&orderId=${orderData._id}`);
                    } else {
                      toast.error(verifyRes.data.message || "Payment verification pending.");
                      router.push("/orders");
                    }
                  } catch (vErr) {
                    console.error("Verification error:", vErr);
                    router.push("/orders");
                  }
                } else if (BOLT.response.txnStatus === "CANCEL") {
                  toast.error("Payment was cancelled.");
                  router.push("/orders");
                } else {
                  toast.error("Payment failed. Please try again.");
                  router.push("/orders");
                }
              },
              catchException: function (BOLT: any) {
                console.error("PayU Bolt exception:", BOLT);
                toast.error("Payment window closed or error occurred.");
                router.push("/orders");
              },
            });
            return;
          }

          // Fallback to Hosted Form Redirect
          const form = document.createElement("form");
          form.method = "POST";
          form.action = actionUrl;

          Object.keys(params).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = params[key] ?? "";
            form.appendChild(input);
          });

          document.body.appendChild(form);
          if (isBuyNow) sessionStorage.removeItem("buyNowItem");
          form.submit();
          return;
        }

        // Fallback for direct order creation
        toast.success("Order created successfully!");
        router.push("/orders");
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

  const effectiveSubtotal = discountInfo ? discountInfo.subtotal : checkoutTotal;
  const effectiveAutoDiscount = discountInfo ? discountInfo.discountAmount : 0;
  const effectiveCouponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const effectiveTotal = Math.max(0, effectiveSubtotal - effectiveAutoDiscount - effectiveCouponDiscount);

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

          {/* Payment Method Selection */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #eaeaea', borderRadius: '8px', background: '#fcfcfc' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Payment Method</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: '1rem' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayU"
                  checked={paymentMethod === "PayU"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ cursor: "pointer", width: "18px", height: "18px" }}
                />
                💳 Pay Online via PayU (UPI / Cards / NetBanking / Wallets)
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

          {/* Button */}
          <button type="submit" disabled={isSubmitting || checkoutItems.length === 0} style={{ marginTop: '1rem', padding: "1rem", background: "#1a8e5f", color: "white", border: "none", borderRadius: "4px", cursor: isSubmitting ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "1.1rem" }}>
            {isSubmitting 
              ? "Processing..." 
              : paymentMethod === "COD" 
                ? `Place Order (COD) - Rs. ${effectiveTotal.toFixed(2)}` 
                : `Proceed to Pay via PayU - Rs. ${effectiveTotal.toFixed(2)}`}
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

            {/* Coupons Section (Not auto-applied, user chooses and clicks Apply) */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '0.6rem' }}>
                🎟️ Promo Coupons
              </h3>

              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ecfdf5', border: '1px dashed #10b981', padding: '0.6rem 0.9rem', borderRadius: '6px' }}>
                  <div>
                    <span style={{ color: '#047857', fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>
                      🏷️ {appliedCoupon.code} Applied
                    </span>
                    <span style={{ color: '#059669', fontSize: '0.85rem' }}>
                      You save Rs. {appliedCoupon.discountAmount.toFixed(2)} with this coupon!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{ flex: 1, padding: '0.55rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCouponCode(couponInput)}
                      style={{ padding: '0.55rem 1.1rem', background: '#1a8e5f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Apply
                    </button>
                  </div>

                  {/* List of Available Coupons to easily Tap & Apply */}
                  {availableCoupons.length > 0 && (
                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.6rem' }}>
                      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '0.4rem', fontWeight: 500 }}>
                        Available Offers for you (Click Apply to use):
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {availableCoupons.map((c) => {
                          const isEligibleForMin = !c.minOrderAmount || effectiveSubtotal >= c.minOrderAmount;
                          return (
                            <div
                              key={c.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '6px'
                              }}
                            >
                              <div>
                                <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.9rem', background: '#e5e7eb', padding: '2px 6px', borderRadius: '3px', marginRight: '6px' }}>
                                  {c.code}
                                </span>
                                <span style={{ fontSize: '0.82rem', color: '#4b5563' }}>
                                  {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                                  {c.minOrderAmount > 0 ? ` (on ₹${c.minOrderAmount}+)` : ''}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleApplyCouponCode(c.code)}
                                disabled={!isEligibleForMin}
                                style={{
                                  background: isEligibleForMin ? '#10b981' : '#d1d5db',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '3px 9px',
                                  borderRadius: '4px',
                                  cursor: isEligibleForMin ? 'pointer' : 'not-allowed',
                                  fontSize: '0.82rem',
                                  fontWeight: 600
                                }}
                              >
                                {isEligibleForMin ? 'Apply' : 'Min ₹' + c.minOrderAmount}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #ddd" }}>
              {(effectiveAutoDiscount > 0 || effectiveCouponDiscount > 0) && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '6px',
                  padding: '0.6rem 0.8rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#15803d',
                  fontSize: '0.92rem',
                  fontWeight: 600
                }}>
                  <span>🎉</span>
                  <span>Total Savings: Rs. {(effectiveAutoDiscount + effectiveCouponDiscount).toFixed(2)} on this order!</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#555" }}>
                <span>Subtotal:</span>
                <span>Rs. {effectiveSubtotal.toFixed(2)}</span>
              </div>

              {effectiveAutoDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#16a34a", fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🎁 Automatic Discount ({discountInfo?.appliedDiscount?.name}):
                  </span>
                  <span style={{ color: '#16a34a' }}>- Rs. {effectiveAutoDiscount.toFixed(2)}</span>
                </div>
              )}

              {effectiveCouponDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#16a34a", fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    🏷️ Coupon Code ({appliedCoupon?.code}):
                  </span>
                  <span style={{ color: '#16a34a' }}>- Rs. {effectiveCouponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.2rem", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px dashed #ccc" }}>
                <span>Total to Pay:</span>
                <span style={{ color: '#111827' }}>Rs. {effectiveTotal.toFixed(2)}</span>
              </div>
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