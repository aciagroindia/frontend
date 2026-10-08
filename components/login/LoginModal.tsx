"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Smartphone,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Sprout,
  Heart,
  ArrowLeft,
  CheckCircle2,
  X,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import styles from "./LoginModal.module.css";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();

  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 850);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (isLoginModalOpen) {
      setStep(1);
      setFormData({ phone: "", password: "" });
      setShowPassword(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = formData.phone.trim();

    if (!phone) {
      toast.error("Mobile Number is required.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const phone = formData.phone.trim();
    const password = formData.password;

    if (!phone) {
      toast.error("Mobile Number is required.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!password) {
      toast.error("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        phone,
        password,
      });

      if (response.data?.success && response.data?.data?.token) {
        toast.success("Login Successful!");
        login(
          response.data.data.token,
          response.data.data.user
        );
        closeLoginModal();
      } else {
        toast.error(
          response.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={closeLoginModal}>
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Login Required"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeLoginModal}
          className={styles.closeBtn}
          aria-label="Close Login Modal"
        >
          <X size={20} />
        </button>

        {/* ================= LEFT HERO BRAND PANEL ================= */}
        <div className={styles.heroPanel}>
          <div className={styles.heroOverlay} />

          <div className={styles.heroContent}>
            {/* Header row */}
            <div className={styles.heroTopBar}>
              <div className={styles.heroLogoWrap}>
                <Image
                  src="/assets/Aci logo.png"
                  alt="Aci Agro Solutions"
                  width={140}
                  height={90}
                  priority
                  className={styles.heroLogo}
                />
              </div>
              <div className={styles.heroScriptBadge}>
                <span>Nature&apos;s Care</span>
                <span className={styles.scriptSub}>in Every Drop 🍃</span>
              </div>
            </div>

            {/* Heading */}
            <h2 className={styles.heroTitle}>
              Pure Goodness<br />
              for a <span className={styles.highlightWord}>Healthier<span className={styles.titleLeaf}>🍃</span></span><br />
              Tomorrow
            </h2>

            <p className={styles.heroTagline}>
              Natural • Safe • Effective
            </p>

            {/* 4 Feature Pills */}
            <div className={styles.featuresRow}>
              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <Leaf size={16} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>100%<br />Natural</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <ShieldCheck size={16} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>Trusted<br />Quality</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <Sprout size={16} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>Better<br />Immunity</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <Heart size={16} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>Healthy<br />Living</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT FORM PANEL ================= */}
        <div className={styles.formPanel}>
          {/* Subtle botanical corner watermarks */}
          <div className={styles.leafWatermarkTop} />
          <div className={styles.leafWatermarkBottom} />

          <div className={styles.formInner}>
            {/* Title & Subtitle */}
            <div className={styles.formHeading}>
              <h3 className={styles.formTitle}>
                Welcome <span className={styles.greenText}>Back</span>
              </h3>
              <p className={styles.formSubtitle}>
                {isMobile
                  ? step === 1
                    ? "Enter mobile number to continue"
                    : "Enter your password to sign in"
                  : "Please sign in to proceed with your order"}
              </p>
            </div>

            {/* ================= DESKTOP VIEW: FULL FORM ================= */}
            {!isMobile && (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {/* Mobile Number */}
                <div className={styles.formGroup}>
                  <label htmlFor="modal-phone-desktop" className={styles.fieldLabel}>
                    Mobile Number
                  </label>
                  <div className={styles.inputWrapper}>
                    <Smartphone className={styles.fieldIcon} size={18} />
                    <input
                      id="modal-phone-desktop"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      autoComplete="tel"
                      className={styles.inputField}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className={styles.formGroup}>
                  <label htmlFor="modal-password-desktop" className={styles.fieldLabel}>
                    Password
                  </label>
                  <div className={styles.inputWrapper}>
                    <LockKeyhole className={styles.fieldIcon} size={18} />
                    <input
                      id="modal-password-desktop"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={`${styles.inputField} ${styles.passwordInput}`}
                    />
                    <button
                      type="button"
                      className={styles.eyeToggleBtn}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Forgot Password */}
                  <div className={styles.forgotPasswordRow}>
                    <Link
                      href="/forgot-password"
                      onClick={closeLoginModal}
                      className={styles.forgotPasswordLink}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  <span>{loading ? "Signing in..." : "Login & Continue"}</span>
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            )}

            {/* ================= MOBILE VIEW: STEP 1 ================= */}
            {isMobile && step === 1 && (
              <form className={styles.form} onSubmit={handleNextStep} noValidate>
                <div className={styles.formGroup}>
                  <label htmlFor="modal-phone-mobile" className={styles.fieldLabel}>
                    Mobile Number
                  </label>
                  <div className={styles.inputWrapper}>
                    <Smartphone className={styles.fieldIcon} size={18} />
                    <input
                      id="modal-phone-mobile"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      autoFocus
                      autoComplete="tel"
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                  <span>Next</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* ================= MOBILE VIEW: STEP 2 ================= */}
            {isMobile && step === 2 && (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.verifiedPhoneBar}>
                  <div className={styles.verifiedPhoneInfo}>
                    <CheckCircle2 size={16} className={styles.verifiedCheckIcon} />
                    <span>+91 {formData.phone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className={styles.changePhoneBtn}
                  >
                    Change
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="modal-password-mobile" className={styles.fieldLabel}>
                    Password
                  </label>
                  <div className={styles.inputWrapper}>
                    <LockKeyhole className={styles.fieldIcon} size={18} />
                    <input
                      id="modal-password-mobile"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoFocus
                      autoComplete="current-password"
                      className={`${styles.inputField} ${styles.passwordInput}`}
                    />
                    <button
                      type="button"
                      className={styles.eyeToggleBtn}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div className={styles.forgotPasswordRow}>
                    <Link
                      href="/forgot-password"
                      onClick={closeLoginModal}
                      className={styles.forgotPasswordLink}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  <span>{loading ? "Signing in..." : "Login & Continue"}</span>
                  {!loading && <ArrowRight size={18} />}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={styles.backStepBtn}
                >
                  <ArrowLeft size={15} />
                  <span>Back to Mobile Number</span>
                </button>
              </form>
            )}

            {/* Divider */}
            <div className={styles.divider}>
              <span className={styles.dividerText}>Or</span>
            </div>

            {/* Create Account Link */}
            <p className={styles.createAccountPrompt}>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                onClick={closeLoginModal}
                className={styles.createAccountLink}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
