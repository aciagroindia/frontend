"use client";

import { useState, useEffect, Suspense } from "react";
import { useCart } from "../../../../context/CartContext";
import { useProducts } from "../../../../context/ProductContext";
import { useAuth } from "../../../../context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { fetchAvailableCoupons } from "../../../../lib/couponApi";
import { toast } from "react-hot-toast";
import {
  MapPin,
  CreditCard,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Loader2,
  X
} from "lucide-react";

// Cashfree Web SDK v3 Loader
const loadCashfreeSDK = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Window not defined"));
    if ((window as any).Cashfree) {
      return resolve((window as any).Cashfree);
    }
    const existingScript = document.getElementById("cashfree-sdk-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve((window as any).Cashfree));
      return;
    }
    const script = document.createElement("script");
    script.id = "cashfree-sdk-script";
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).Cashfree) {
        resolve((window as any).Cashfree);
      } else {
        reject(new Error("Cashfree SDK failed to initialize"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.body.appendChild(script);
  });
};

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
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Payment Method selection: default is Cashfree (Online)
  const [paymentMethod, setPaymentMethod] = useState("Cashfree");

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

  // Auto pre-fill the best eligible coupon code when conditions are met
  useEffect(() => {
    if (availableCoupons.length > 0 && !appliedCoupon) {
      const currentSubtotal = discountInfo ? discountInfo.subtotal : checkoutTotal;
      const eligible = availableCoupons.filter(
        (c) => !c.minOrderAmount || currentSubtotal >= c.minOrderAmount
      );
      if (eligible.length > 0) {
        // Pre-fill with the first eligible coupon code
        setCouponInput(eligible[0].code);
      } else {
        setCouponInput("");
      }
    }
  }, [availableCoupons, checkoutTotal, discountInfo, appliedCoupon]);

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
      setIsApplyingCoupon(true);
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
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.success("Coupon removed.");
  };

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
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
    setShippingAddress((prev) => {
      const next = { ...prev, [name]: value };
      // Sync pinCode and postalCode if either is updated
      if (name === "pinCode" && !prev.postalCode) {
        next.postalCode = value;
      } else if (name === "postalCode" && !prev.pinCode) {
        next.pinCode = value;
      }
      return next;
    });
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

        // 2. CASHFREE IN-APP MODAL CHECKOUT FLOW (Stays on website)
        if (response.data.cashfree) {
          const { payment_session_id, order_id, environment } = response.data.cashfree;

          toast.loading("Opening secure payment popup...", { id: "cf-launch" });

          if (isBuyNow) sessionStorage.removeItem("buyNowItem");
          else await fetchCart();

          try {
            const Cashfree = await loadCashfreeSDK();
            const cashfree = Cashfree({
              mode: environment === "PRODUCTION" ? "production" : "sandbox",
            });

            toast.dismiss("cf-launch");

            // Modal overlay stays directly on website without redirecting away
            const result = await cashfree.checkout({
              paymentSessionId: payment_session_id,
              redirectTarget: "_modal",
            });

            if (result && result.error) {
              console.warn("Cashfree modal closed or error:", result.error);
              if (result.error.message && !result.error.message.includes("closed")) {
                toast.error(result.error.message);
              }
              // Redirect to orders so user can see their pending order and retry anytime
              router.push("/orders");
              return;
            }

            if (result && result.paymentDetails) {
              toast.loading("Verifying payment...", { id: "cf-verify" });
              try {
                await axiosInstance.post("/orders/cashfree-verify", { cfOrderId: order_id });
              } catch (vErr) {
                console.warn("Verification ping:", vErr);
              }
              toast.success("Payment Successful! Order Confirmed.", { id: "cf-verify" });
              router.push(`/orders?order_id=${order_id}&order_status=PAID`);
              return;
            }

            // Fallback for any redirection inside modal
            router.push("/orders");
            return;
          } catch (sdkErr: any) {
            console.error("Cashfree SDK launch failed:", sdkErr);
            toast.error("Failed to launch checkout popup. Redirecting to orders...", { id: "cf-launch" });
            router.push("/orders");
            return;
          }
        }

        // 3. LEGACY PAYU FALLBACK FLOW
        if (response.data.payu) {
          const { actionUrl, params } = response.data.payu;

          toast.loading("Redirecting to payment gateway...", { id: "payu-launch" });

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
          else await fetchCart();
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
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Please log in or create an account to securely complete your checkout.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 px-4 bg-[#1a8e5f] hover:bg-[#15774e] text-white font-semibold rounded-xl shadow transition-colors"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  const effectiveSubtotal = discountInfo ? discountInfo.subtotal : checkoutTotal;
  const effectiveAutoDiscount = discountInfo ? discountInfo.discountAmount : 0;
  const effectiveCouponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const effectiveTotal = Math.max(0, effectiveSubtotal - effectiveAutoDiscount - effectiveCouponDiscount);

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb / Top Bar */}
        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-[#1a8e5f] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex flex-wrap items-center gap-3">
            <span>Checkout</span>
            {isBuyNow && (
              <span className="text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-0.5 rounded-full">
                ⚡ Buy Now Mode
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Complete your order details below to place your order.
          </p>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column: Form & Payment (7 Cols on desktop, 100% on mobile) */}
          <div className="w-full lg:col-span-7 xl:col-span-7 space-y-6">

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">

              {/* Shipping Address Section */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-6 md:p-7">
                <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#1a8e5f] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      1. Delivery Address
                    </h2>
                    <p className="text-xs text-gray-500">Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Full Name & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Rahul Sharma"
                        value={shippingAddress.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="10-digit mobile number"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-gray-400 font-normal">(for tracking & order updates)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. customer@example.com"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    />
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Flat / House No. / Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      placeholder="House/Flat number, building, street, area"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    />
                  </div>

                  {/* City & Pin Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        City / District <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="e.g. Pune"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pinCode"
                        placeholder="6-digit PIN code"
                        value={shippingAddress.pinCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Postal Code & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={shippingAddress.postalCode || shippingAddress.pinCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="e.g. Maharashtra"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection Card */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-6 md:p-7">
                <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#1a8e5f] flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      2. Payment Method
                    </h2>
                    <p className="text-xs text-gray-500">Choose how you'd like to pay</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Cashfree Online Option */}
                  <label
                    onClick={() => setPaymentMethod("Cashfree")}
                    className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${paymentMethod === "Cashfree"
                        ? "border-[#1a8e5f] bg-emerald-50/40 shadow-sm ring-1 ring-[#1a8e5f]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cashfree"
                      checked={paymentMethod === "Cashfree"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-4 h-4 text-[#1a8e5f] focus:ring-[#1a8e5f] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
                          <span>Pay Online (UPI, Cards, NetBanking, Wallets)</span>
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Instant, secure payments via UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards, NetBanking, and Wallets.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${paymentMethod === "COD"
                        ? "border-[#1a8e5f] bg-emerald-50/40 shadow-sm ring-1 ring-[#1a8e5f]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-4 h-4 text-[#1a8e5f] focus:ring-[#1a8e5f] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
                          <span>Cash on Delivery (COD)</span>
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Pay in cash upon receiving your order at your delivery address.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button (Primary on desktop, also works smoothly on mobile) */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || checkoutItems.length === 0}
                  className="w-full py-3.5 sm:py-4 px-6 bg-[#1a8e5f] hover:bg-[#15774e] active:scale-[0.99] text-white font-bold text-base sm:text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : paymentMethod === "COD" ? (
                    <span>Place Order (COD) • ₹{effectiveTotal.toFixed(2)}</span>
                  ) : (
                    <span>Proceed to Pay Online • ₹{effectiveTotal.toFixed(2)}</span>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-center text-[11px] sm:text-xs text-gray-500">
                  <div className="flex items-center justify-center gap-1 bg-white p-2 rounded-lg border border-gray-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">100% Secure</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 bg-white p-2 rounded-lg border border-gray-100">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">Fast Shipping</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1 bg-white p-2 rounded-lg border border-gray-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">Verified Quality</span>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary & Coupons (5 Cols on desktop, Sticky on LG+) */}
          <div className="w-full lg:col-span-5 xl:col-span-5 space-y-6 lg:sticky lg:top-24">

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-6">

              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#1a8e5f]" />
                  <span>Order Summary</span>
                </h2>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {checkoutItems.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Your cart is empty.</p>
                  <Link href="/products" className="mt-3 inline-block text-xs font-bold text-[#1a8e5f] hover:underline">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-gray-100 pr-1 mb-5">
                    {checkoutItems.map((item, idx) => {
                      const fullProduct = allProducts.find((p: any) => p._id === item.productId);
                      const image = fullProduct?.image || item.image || "/placeholder.png";

                      return (
                        <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0">
                            <Image
                              src={image}
                              alt={item.name || "Product"}
                              fill
                              sizes="(max-width: 640px) 56px, 64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Qty: <span className="font-medium text-gray-700">{item.quantity}</span>
                              {item.unit && <span className="ml-1 text-gray-400">({item.unit})</span>}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Promo Coupons Section - ONLY rendered if user fulfills conditions or coupon is applied */}
                  {(() => {
                    const eligibleCoupons = availableCoupons.filter(
                      (c) => !c.minOrderAmount || effectiveSubtotal >= c.minOrderAmount
                    );
                    const showCouponSection = appliedCoupon !== null || eligibleCoupons.length > 0;

                    if (!showCouponSection) return null;

                    return (
                      <div className="p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-200/80 mb-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                            <Tag className="w-4 h-4 text-[#1a8e5f]" />
                            <span>Promo Coupons & Offers</span>
                          </h3>
                          {appliedCoupon ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Applied
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Offer Available
                            </span>
                          )}
                        </div>

                        {appliedCoupon ? (
                          <div className="flex items-center justify-between gap-2 p-3 bg-emerald-50 border border-dashed border-emerald-300 rounded-lg">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span className="font-bold text-xs sm:text-sm text-emerald-800 tracking-wider truncate">
                                  {appliedCoupon.code}
                                </span>
                              </div>
                              <p className="text-[11px] sm:text-xs text-emerald-600 mt-0.5">
                                Saved ₹{appliedCoupon.discountAmount.toFixed(2)} with this coupon!
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="flex-shrink-0 p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors text-xs font-semibold"
                              title="Remove Coupon"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="COUPON CODE"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleApplyCouponCode(couponInput)}
                                disabled={isApplyingCoupon || !couponInput.trim()}
                                className="px-4 py-2 bg-[#1a8e5f] hover:bg-[#15774e] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex-shrink-0"
                              >
                                {isApplyingCoupon ? "Applying..." : "Apply"}
                              </button>
                            </div>

                            {/* Pre-fill Hint */}
                            {couponInput && (
                              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                                <Sparkles className="w-3 h-3 flex-shrink-0" />
                                <span>Code pre-filled for you! Tap <strong>Apply</strong> to get discount.</span>
                              </p>
                            )}

                            {/* Eligible Offers List */}
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-[11px] font-semibold text-gray-500 mb-2">
                                Available offers for your order:
                              </p>
                              <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
                                {eligibleCoupons.map((c) => (
                                  <div
                                    key={c.id || c.code}
                                    onClick={() => {
                                      setCouponInput(c.code);
                                      handleApplyCouponCode(c.code);
                                    }}
                                    className="p-2.5 bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/20 rounded-lg flex flex-wrap items-center justify-between gap-2 shadow-2xs cursor-pointer transition-all"
                                  >
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded tracking-wide">
                                          {c.code}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-900">
                                          {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                        </span>
                                      </div>
                                      {c.minOrderAmount > 0 && (
                                        <p className="text-[10px] mt-0.5 text-emerald-600 font-medium">
                                          ✓ Valid on orders above ₹{c.minOrderAmount}
                                        </p>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCouponInput(c.code);
                                        handleApplyCouponCode(c.code);
                                      }}
                                      disabled={isApplyingCoupon}
                                      className="px-3 py-1.5 text-[11px] font-bold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs transition-colors"
                                    >
                                      Apply
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}

                  {/* Savings Banner */}
                  {(effectiveAutoDiscount > 0 || effectiveCouponDiscount > 0) && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>
                        Total Savings: ₹{(effectiveAutoDiscount + effectiveCouponDiscount).toFixed(2)} on this order!
                      </span>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-2.5 text-xs sm:text-sm border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">₹{effectiveSubtotal.toFixed(2)}</span>
                    </div>

                    {effectiveAutoDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span className="flex items-center gap-1">
                          <span>Automatic Discount ({discountInfo?.appliedDiscount?.name || 'Applied'})</span>
                        </span>
                        <span>- ₹{effectiveAutoDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    {effectiveCouponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span className="flex items-center gap-1">
                          <span>Coupon Discount ({appliedCoupon?.code})</span>
                        </span>
                        <span>- ₹{effectiveCouponDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charges</span>
                      <span className="font-semibold text-emerald-700">FREE</span>
                    </div>

                    {/* Total Row */}
                    <div className="border-t border-dashed border-gray-200 pt-3 mt-3 flex justify-between items-baseline">
                      <div>
                        <span className="text-sm sm:text-base font-bold text-gray-900 block">Total Amount</span>
                        <span className="text-[11px] text-gray-400 font-normal">Inclusive of all taxes</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#1a8e5f]">
                          ₹{effectiveTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a8e5f]" />
          <p className="text-sm font-medium text-gray-600">Loading Checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}