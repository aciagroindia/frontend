"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./signUp.module.css";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

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
            {/* Logo */}
            <div className={styles.heroLogoWrap}>
              <Image
                src="/assets/Aci logo.png"
                alt="Aci Agro Solutions"
                width={170}
                height={115}
                priority
                className={styles.heroLogo}
              />
            </div>

            {/* Tagline */}
            <div className={styles.heroTagline}>
              <span>HEALTHY</span>
              <span className={styles.taglineDot}>|</span>
              <span>ETHICAL</span>
              <span className={styles.taglineDot}>|</span>
              <span>DELICIOUS</span>
            </div>

            {/* Main Heading */}
            <h1 className={styles.heroTitle}>
              Pure Goodness<br />
              for a <span className={styles.highlightWord}>Healthier</span><br />
              <span className={styles.underlinedWord}>Tomorrow</span>
            </h1>

            {/* Description */}
            <p className={styles.heroDescription}>
              Natural herbal juices crafted with care for your everyday wellness.
            </p>

            {/* Feature Pills */}
            <div className={styles.featuresRow}>
              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <Leaf size={20} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>Natural<br />Ingredients</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <ShieldCheck size={20} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>Premium<br />Quality</span>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIconCircle}>
                  <Sprout size={20} strokeWidth={2.2} />
                </div>
                <span className={styles.featureText}>Healthy<br />Lifestyle</span>
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