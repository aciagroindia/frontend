"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Smartphone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Leaf,
  ShieldCheck,
  Sprout,
  Heart,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./signUp.module.css";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get("phone") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: initialPhone,
    password: "",
  });

  useEffect(() => {
    const p = searchParams.get("phone");
    if (p) {
      setFormData((prev) => ({ ...prev, phone: p }));
    }
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const password = formData.password;

    if (!name) {
      toast.error("Full Name is required.");
      return;
    }
    if (!email) {
      toast.error("Email Address is required.");
      return;
    }
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
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        phone,
        password,
      });

      if (response.data?.success || (response.data && response.data.data?.token)) {
        toast.success("Account created successfully! Please log in.");
        if (response.data.data?.token) {
          localStorage.setItem("token", response.data.data.token);
        }
        router.push("/login");
      } else {
        toast.error(response.data?.message || "An unexpected error occurred.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
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

            {/* 4 Feature Pills in a row */}
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

          {/* Corner leaf illustrations */}
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
            {/* Header Brand Logo */}
            <div className={styles.formLogoWrap}>
              <Image
                src="/assets/Aci logo.png"
                alt="Aci Agro Solutions"
                width={170}
                height={115}
                priority
                className={styles.formLogo}
              />
            </div>

            {/* Title & Subtitle */}
            <div className={styles.formHeading}>
              <h2 className={styles.formTitle}>
                Create <span className={styles.greenText}>Account</span>
              </h2>
              <p className={styles.formSubtitle}>
                Sign up to start your journey with ACI Agro
              </p>
            </div>

            {/* Sign Up Form */}
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.fieldLabel}>
                  Full Name
                </label>
                <div className={styles.inputWrapper}>
                  <User className={styles.fieldIcon} size={18} />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={styles.inputField}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.fieldLabel}>
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.fieldIcon} size={18} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className={styles.inputField}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.fieldLabel}>
                  Mobile Number
                </label>
                <div className={styles.inputWrapper}>
                  <Smartphone className={styles.fieldIcon} size={18} />
                  <input
                    id="phone"
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
                <label htmlFor="password" className={styles.fieldLabel}>
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <LockKeyhole className={styles.fieldIcon} size={18} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
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
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Divider */}
            <div className={styles.divider}>
              <span className={styles.dividerText}>Or</span>
            </div>

            {/* Footer / Login link */}
            <p className={styles.loginPrompt}>
              Already have an account?{" "}
              <Link href="/login" className={styles.loginLink}>
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}