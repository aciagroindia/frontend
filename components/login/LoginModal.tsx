"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  KeyRound,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import styles from "./LoginModal.module.css";

export default function LoginModal() {
  const router = useRouter();
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();

  const [isMobile, setIsMobile] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "forgot_step1" | "forgot_step2">("login");
  const [step, setStep] = useState<1 | 2>(1);

  // Login form state
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  // Forgot password form state
  const [forgotPhone, setForgotPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<{ name: string; phone: string } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      setAuthMode("login");
      setStep(1);
      setFormData({ phone: "", password: "" });
      setForgotPhone("");
      setNewPassword("");
      setConfirmPassword("");
      setVerifiedUser(null);
      setShowPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
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

  // Switch to forgot password flow
  const handleOpenForgot = () => {
    setAuthMode("forgot_step1");
    if (formData.phone) {
      setForgotPhone(formData.phone);
    }
  };

  // Back to login mode
  const handleBackToLogin = () => {
    setAuthMode("login");
    setStep(1);
    setNewPassword("");
    setConfirmPassword("");
  };

  // Mobile step 1 handler
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

  // Login submission
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
        closeLoginModal();
        router.push(`/signup?phone=${encodeURIComponent(phone)}`);
      }
    } catch (err: any) {
      const isNotReg = err.response?.status === 404 || err.response?.data?.notRegistered;
      if (isNotReg) {
        toast.error("This mobile number is not registered. Redirecting to Create Account...", { duration: 3000 });
        closeLoginModal();
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
            {/* ================= FORGOT PASSWORD: STEP 1 (VERIFY PHONE) ================= */}
            {authMode === "forgot_step1" && (
              <>
                <div className={styles.formHeading}>
                  <h3 className={styles.formTitle}>
                    Forgot <span className={styles.greenText}>Password?</span>
                  </h3>
                  <p className={styles.formSubtitle}>
                    Enter your registered 10-digit mobile number to set a new password.
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleVerifyForgotPhone} noValidate>
                  <div className={styles.formGroup}>
                    <label htmlFor="modal-forgot-phone" className={styles.fieldLabel}>
                      Registered Mobile Number
                    </label>
                    <div className={styles.inputWrapper}>
                      <Smartphone className={styles.fieldIcon} size={18} />
                      <input
                        id="modal-forgot-phone"
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
                    <ArrowLeft size={15} />
                    <span>Back to Login</span>
                  </button>
                </form>
              </>
            )}

            {/* ================= FORGOT PASSWORD: STEP 2 (SET NEW PASSWORD) ================= */}
            {authMode === "forgot_step2" && (
              <>
                <div className={styles.formHeading}>
                  <h3 className={styles.formTitle}>
                    Create <span className={styles.greenText}>New Password</span>
                  </h3>
                  <p className={styles.formSubtitle}>
                    {verifiedUser?.name ? `Hi ${verifiedUser.name.split(' ')[0]}, enter your new password.` : "Enter your new password below."}
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleResetPassword} noValidate>
                  <div className={styles.verifiedPhoneBar}>
                    <div className={styles.verifiedPhoneInfo}>
                      <CheckCircle2 size={16} className={styles.verifiedCheckIcon} />
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
                    <label htmlFor="modal-new-password" className={styles.fieldLabel}>
                      New Password
                    </label>
                    <div className={styles.inputWrapper}>
                      <KeyRound className={styles.fieldIcon} size={18} />
                      <input
                        id="modal-new-password"
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
                    <label htmlFor="modal-confirm-password" className={styles.fieldLabel}>
                      Confirm Password
                    </label>
                    <div className={styles.inputWrapper}>
                      <LockKeyhole className={styles.fieldIcon} size={18} />
                      <input
                        id="modal-confirm-password"
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
                    <ArrowLeft size={15} />
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
                        <button
                          type="button"
                          onClick={handleOpenForgot}
                          className={styles.forgotPasswordLink}
                        >
                          Forgot Password?
                        </button>
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
                        <button
                          type="button"
                          onClick={handleOpenForgot}
                          className={styles.forgotPasswordLink}
                        >
                          Forgot Password?
                        </button>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
