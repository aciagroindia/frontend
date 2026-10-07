"use client";

import { useState } from "react";
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
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

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
            {/* Logo Badge */}
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
                Welcome <span className={styles.greenText}>Back</span>
              </h2>
              <p className={styles.formSubtitle}>
                Sign in to your ACI Agro account
              </p>
            </div>

            {/* Login Form */}
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Mobile Number Field */}
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

              {/* Password Field */}
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