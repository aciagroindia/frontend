"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  // Screen size detection: only small screens use 2-step flow
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Step 1 = Enter Phone, Step 2 = Enter Password (used on mobile only)
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mobile Step 1 handler: Validate phone and proceed to password
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

  // Submit login with phone & password (used on desktop and mobile step 2)
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
        login(
          response.data.data.token,
          response.data.data.user
        );

        toast.success("Login Successful!");
        router.push("/");
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
    <main className={styles.pageContainer}>
      {/* Outer blurred botanical background overlay */}
      <div className={styles.pageBackdrop} />

      {/* Main Centered Auth Card */}
      <div className={styles.authCard}>
        {/* ================= LEFT HERO BRAND PANEL ================= */}
        <div className={styles.heroPanel}>
          <div className={styles.heroOverlay} />
          
          <div className={styles.heroContent}>
            {/* Header row: Logo on left & Nature's Care on right */}
            <div className={styles.heroTopBar}>
              <div className={styles.heroLogoWrap}>
                <Image
                  src="/assets/Aci logo.png"
                  alt="Aci Agro Solutions"
                  width={155}
                  height={100}
                  priority
                  className={styles.heroLogo}
                />
              </div>
              <div className={styles.heroScriptBadge}>
                <span>Nature&apos;s Care</span>
                <span className={styles.scriptSub}>in Every Drop 🍃</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className={styles.heroTitle}>
              Pure Goodness<br />
              for a <span className={styles.highlightWord}>Healthier<span className={styles.titleLeaf}>🍃</span></span><br />
              Tomorrow
            </h1>

            {/* Sub-tagline */}
            <p className={styles.heroTagline}>
              Natural • Safe • Effective
            </p>

            {/* 4 Feature Pills in a row matching mockup */}
            <div className={styles.featuresRow}>
              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <Leaf size={18} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>100%<br />Natural</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <ShieldCheck size={18} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>Trusted<br />Quality</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <Sprout size={18} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>Better<br />Immunity</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <Heart size={18} strokeWidth={2.2} />
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
          
          {/* Mockup matching botanical leaf corners */}
          <div className={styles.cornerLeafBottomLeft}>
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 90C25 80 40 60 45 35C25 45 15 65 10 90Z" fill="#a7f3d0" fillOpacity="0.45" />
              <path d="M10 90C35 75 60 65 85 60C65 50 40 55 10 90Z" fill="#6ee7b7" fillOpacity="0.35" />
            </svg>
          </div>
          <div className={styles.cornerLeafBottomRight}>
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M90 90C75 80 60 60 55 35C75 45 85 65 90 90Z" fill="#a7f3d0" fillOpacity="0.45" />
              <path d="M90 90C65 75 40 65 15 60C35 50 60 55 90 90Z" fill="#6ee7b7" fillOpacity="0.35" />
            </svg>
          </div>

          <div className={styles.formInner}>
            {/* Title & Subtitle */}
            <div className={styles.formHeading}>
              <h2 className={styles.formTitle}>
                Welcome <span className={styles.greenText}>Back</span>
              </h2>
              <p className={styles.formSubtitle}>
                {isMobile
                  ? step === 1 
                    ? "Enter your mobile number to get started" 
                    : "Enter your password to sign in"
                  : "Enter your credentials to sign in to your account"}
              </p>
            </div>

            {/* ================= DESKTOP VIEW: STANDARD FULL FORM (BOTH INPUTS TOGETHER) ================= */}
            {!isMobile && (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {/* Mobile Number Field */}
                <div className={styles.formGroup}>
                  <label htmlFor="phone-desktop" className={styles.fieldLabel}>
                    Mobile Number
                  </label>
                  <div className={styles.inputWrapper}>
                    <Smartphone className={styles.fieldIcon} size={18} />
                    <input
                      id="phone-desktop"
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

                {/* Password Field */}
                <div className={styles.formGroup}>
                  <label htmlFor="password-desktop" className={styles.fieldLabel}>
                    Password
                  </label>
                  <div className={styles.inputWrapper}>
                    <LockKeyhole className={styles.fieldIcon} size={18} />
                    <input
                      id="password-desktop"
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

                  {/* Forgot Password Link */}
                  <div className={styles.forgotPasswordRow}>
                    <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  <span>{loading ? "Signing in..." : "Login"}</span>
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            )}

            {/* ================= MOBILE VIEW: STEP 1 (MOBILE NUMBER ONLY) ================= */}
            {isMobile && step === 1 && (
              <form className={styles.form} onSubmit={handleNextStep} noValidate>
                <div className={styles.formGroup}>
                  <label htmlFor="phone-mobile" className={styles.fieldLabel}>
                    Mobile Number
                  </label>
                  <div className={styles.inputWrapper}>
                    <Smartphone className={styles.fieldIcon} size={18} />
                    <input
                      id="phone-mobile"
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

                {/* Next Button */}
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  <span>Next</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* ================= MOBILE VIEW: STEP 2 (PASSWORD ONLY) ================= */}
            {isMobile && step === 2 && (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {/* Mobile number summary pill with Change button */}
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

                {/* Password Field */}
                <div className={styles.formGroup}>
                  <label htmlFor="password-mobile" className={styles.fieldLabel}>
                    Password
                  </label>
                  <div className={styles.inputWrapper}>
                    <LockKeyhole className={styles.fieldIcon} size={18} />
                    <input
                      id="password-mobile"
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

                  {/* Forgot Password Link */}
                  <div className={styles.forgotPasswordRow}>
                    <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  <span>{loading ? "Signing in..." : "Login"}</span>
                  {!loading && <ArrowRight size={18} />}
                </button>

                {/* Back to Mobile step button */}
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

            {/* Footer / Create Account */}
            <p className={styles.createAccountPrompt}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className={styles.createAccountLink}>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}