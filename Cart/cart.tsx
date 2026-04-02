"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./cart.module.css";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { products: allProducts } = useProducts();

  const subtotal = cartTotal;
  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(
    freeShippingThreshold - subtotal,
    0,
  );

  // Calculate progress for the truck and bar
  const safePercentage = useMemo(() => {
    const raw = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    return Math.min(Math.max(raw, 5), 95);
  }, [subtotal]);

  const handleCheckout = () => {
    onClose(); // Cart ko band karein
    router.push("/checkout"); // Checkout page par navigate karein
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Original UI */}
          <motion.div
            className={styles.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Cart Container - Original UI structure */}
          <motion.div
            className={styles.cartContainer}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
          >
            {/* Header - Original HTML */}
            <div className={styles.header}>
              <h2>SHOPPING CART ({cartItems.length})</h2>
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close cart"
              >
                <Image
                  src="/assets/Close.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Shipping Progress - Original HTML */}
            <div className={styles.shippingProgress}>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${safePercentage}%` }}
                />
                <div
                  className={styles.truckIcon}
                  style={{
                    left: `${safePercentage}%`,
                    transition: "left 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <Image
                    src="/assets/deliveryTruck.svg"
                    alt="Shipping"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <p className={styles.shippingText}>
                {remainingForFreeShipping > 0 ? (
                  <>
                    Spend <span>Rs. {remainingForFreeShipping.toFixed(2)}</span>{" "}
                    more to enjoy <span>Free shipping!</span>
                  </>
                ) : (
                  <>
                    Congratulations! You've got <span>Free Shipping!</span>
                  </>
                )}
              </p>
            </div>

            {cartItems.length === 0 ? (
              /* Empty State - Original HTML */
              <div className={styles.emptyState}>
                <Image src="/assets/cart.png" alt="" width={100} height={100} />

                <h3>YOUR CART IS EMPTY</h3>

                <button className={styles.continueButton} onClick={onClose}>
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              /* Populated Cart State - Original HTML */
              <>
                <div className={styles.mainContent}>
                  {cartItems.map((item) => {
                    // Find the full product from the global context to get the correct, normalized image.
                    const fullProduct = allProducts.find(p => p._id === item.productId);
                    // Use the image from the full product if found, otherwise fallback to the item's image.
                    const image = fullProduct?.image || item.image;
                    // Use the image from the full product if found, otherwise fallback to the item's image, then a placeholder.
                    const imageSrc = fullProduct?.image || item.image || "/placeholder.png";

                    return (
                      <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemImageWrapper}>
                        {image ? (
                          <Image
                            src={image}
                            alt={item.name}
                            fill
                            className={styles.itemImage}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
                        )}
                          <Image src={imageSrc} alt={item.name} fill className={styles.itemImage} />
                      </div>
                      <div
                        className={styles.itemDetails}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className={styles.itemHeader}>
                          <div>
                            <h4 className={styles.itemTitle}>{item.name}</h4>
                            {item.variant && (
                              <p className={styles.itemVariant}>
                                {item.variant}
                              </p>
                            )}
                          </div>
                          <button
                            className={styles.removeButton}
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <Image
                              src="/assets/Close.svg"
                              alt=""
                              width={16}
                              height={16}
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                        <div
                          className={styles.itemFooter}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "auto",
                          }}
                        >
                          <div className={styles.quantityControls}>
                            <button
                              className={styles.qtyBtn}
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className={styles.qtyValue}>
                              {item.quantity}
                            </span>
                            <button
                              className={styles.qtyBtn}
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <div className={styles.itemPrice}>
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>

                <div
                  className={styles.cartFooter}
                  style={{
                    paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
                  }}
                >
                  <div className={styles.subtotalRow}>
                    <span className={styles.subtotalLabel}>Subtotal:</span>
                    <span className={styles.subtotalValue}>
                      Rs. {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    className={styles.checkoutButton}
                    onClick={handleCheckout}
                  >
                    Checkout Now
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
