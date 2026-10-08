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
  KeyRound,
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

  const [authMode, setAuthMode] = useState<"login" | "forgot_step1" | "forgot_step2">("login");
  const [step, setStep] = useState<1 | 2>(1);

  // Login credentials
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  // Forgot password states
  const [forgotPhone, setForgotPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<{ name: string; phone: string } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenForgot = () => {
    setAuthMode("forgot_step1");
    if (formData.phone) {
      setForgotPhone(formData.phone);
    }
  };

  const handleBackToLogin = () => {
    setAuthMode("login");
    setStep(1);
    setNewPassword("");
    setConfirmPassword("");
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

  // Forgot Password: Step 1 Verify Phone
  const handleVerifyForgotPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = forgotPhone.trim();

    if (!phone) {
      toast.error("Please enter your mobile number.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password/verify-phone", {
        phone,
      });

      if (response.data?.success) {
        setVerifiedUser(response.data.data);
        setAuthMode("forgot_step2");
        toast.success("Mobile number verified! Please set your new password.");
      } else {
        toast.error("This mobile number is not registered. Redirecting to Create Account...", { duration: 3000 });
        router.push(`/signup?phone=${encodeURIComponent(phone)}`);
      }
    } catch (err: any) {
      const isNotReg = err.response?.status === 404 || err.response?.data?.notRegistered;
      if (isNotReg) {
        toast.error("This mobile number is not registered. Redirecting to Create Account...", { duration: 3000 });
        router.push(`/signup?phone=${encodeURIComponent(phone)}`);
      } else {
        toast.error(
          err.response?.data?.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 2 Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password/reset", {
        phone: forgotPhone.trim(),
        newPassword,
        confirmPassword,
      });

      if (response.data?.success) {
        toast.success("Password updated successfully! Please log in.");
        setFormData({
          phone: forgotPhone.trim(),
          password: "",
        });
        setNewPassword("");
        setConfirmPassword("");
        setAuthMode("login");
        setStep(1);
      } else {
        toast.error(response.data?.message || "Failed to reset password.");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update password. Please try again."
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
            {/* ================= FORGOT PASSWORD: STEP 1 (VERIFY PHONE) ================= */}
            {authMode === "forgot_step1" && (
              <>
                <div className={styles.formHeading}>
                  <h2 className={styles.formTitle}>
                    Forgot <span className={styles.greenText}>Password?</span>
                  </h2>
                  <p className={styles.formSubtitle}>
                    Enter your registered 10-digit mobile number to reset your password.
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleVerifyForgotPhone} noValidate>
                  <div className={styles.formGroup}>
                    <label htmlFor="login-forgot-phone" className={styles.fieldLabel}>
                      Registered Mobile Number
                    </label>
                    <div className={styles.inputWrapper}>
                      <Smartphone className={styles.fieldIcon} size={18} />
                      <input
                        id="login-forgot-phone"
                        type="tel"
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="Enter 10-digit mobile number"
                        inputMode="numeric"
                        maxLength={10}
                        autoFocus
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    <span>{loading ? "Checking Number..." : "Continue"}</span>
                    {!loading && <ArrowRight size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className={styles.backStepBtn}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Login</span>
                  </button>
                </form>
              </>
            )}

            {/* ================= FORGOT PASSWORD: STEP 2 (RESET PASSWORD) ================= */}
            {authMode === "forgot_step2" && (
              <>
                <div className={styles.formHeading}>
                  <h2 className={styles.formTitle}>
                    Create <span className={styles.greenText}>New Password</span>
                  </h2>
                  <p className={styles.formSubtitle}>
                    {verifiedUser?.name ? `Hi ${verifiedUser.name.split(' ')[0]}, please set your new password below.` : "Enter your new password below."}
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleResetPassword} noValidate>
                  <div className={styles.verifiedPhoneBar}>
                    <div className={styles.verifiedPhoneInfo}>
                      <CheckCircle2 size={18} className={styles.verifiedCheckIcon} />
                      <span>+91 {forgotPhone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAuthMode("forgot_step1")}
                      className={styles.changePhoneBtn}
                    >
                      Change
                    </button>
                  </div>

                  {/* New Password */}
                  <div className={styles.formGroup}>
                    <label htmlFor="login-new-password" className={styles.fieldLabel}>
                      New Password
                    </label>
                    <div className={styles.inputWrapper}>
                      <KeyRound className={styles.fieldIcon} size={18} />
                      <input
                        id="login-new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 6 characters)"
                        autoFocus
                        className={`${styles.inputField} ${styles.passwordInput}`}
                      />
                      <button
                        type="button"
                        className={styles.eyeToggleBtn}
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className={styles.formGroup}>
                    <label htmlFor="login-confirm-password" className={styles.fieldLabel}>
                      Confirm Password
                    </label>
                    <div className={styles.inputWrapper}>
                      <LockKeyhole className={styles.fieldIcon} size={18} />
                      <input
                        id="login-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className={`${styles.inputField} ${styles.passwordInput}`}
                      />
                      <button
                        type="button"
                        className={styles.eyeToggleBtn}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    <span>{loading ? "Updating Password..." : "Update Password & Login"}</span>
                    {!loading && <ArrowRight size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className={styles.backStepBtn}
                  >
                    <ArrowLeft size={16} />
                    <span>Cancel & Return to Login</span>
                  </button>
                </form>
              </>
            )}

            {/* ================= STANDARD LOGIN VIEW ================= */}
            {authMode === "login" && (
              <>
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

                {/* ================= DESKTOP VIEW: STANDARD FULL FORM ================= */}
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
                        <button
                          type="button"
                          onClick={handleOpenForgot}
                          className={styles.forgotPasswordLink}
                        >
                          Forgot Password?
                        </button>
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
                        <button
                          type="button"
                          onClick={handleOpenForgot}
                          className={styles.forgotPasswordLink}
                        >
                          Forgot Password?
                        </button>
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
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}