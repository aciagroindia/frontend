"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import { 
  User, 
  Lock, 
  Bell, 
  Camera, 
  Save, 
  LogOut, 
  MessageCircle, 
  ExternalLink, 
  CheckCircle2,
  Database,
  Trash2,
  Sparkles,
  RefreshCw
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-hot-toast";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const router = useRouter();
  const { user: profile, updateUser, logout } = useAuth() as any; 
  
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [isProfileUnchanged, setIsProfileUnchanged] = useState(true);

  // Database Cleanup State
  const [cleanupStats, setCleanupStats] = useState({
    cancelledOrders: 0,
    closedInquiries: 0,
    totalNotifications: 0,
  });
  const [isCleaning, setIsCleaning] = useState(false);

  // WhatsApp Config state
  const [whatsAppForm, setWhatsAppForm] = useState({
    phoneNumber: "919876543210",
    message: "Hello ACI Agro Solutions, I would like to inquire about your ayurvedic products.",
    customUrl: "",
    isEnabled: true,
  });
  const [isSavingWhatsApp, setIsSavingWhatsApp] = useState(false);

  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      const hasChanged = profile.name !== profileForm.name || profile.email !== profileForm.email;
      setIsProfileUnchanged(!hasChanged);
    }
  }, [profile, profileForm]);

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        setLoading(true);
        // 1. Preferences
        const prefRes = await axiosInstance.get("/admin/settings/preferences");
        if (prefRes.data.success) {
          setPreferences(prefRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }

      try {
        // 2. WhatsApp config
        const waRes = await axiosInstance.get("/config/whatsapp");
        if (waRes.data.success && waRes.data.data) {
          setWhatsAppForm({
            phoneNumber: waRes.data.data.phoneNumber || "919876543210",
            message: waRes.data.data.message || "Hello ACI Agro Solutions, I would like to inquire about your ayurvedic products.",
            customUrl: waRes.data.data.customUrl || "",
            isEnabled: waRes.data.data.isEnabled !== false,
          });
        }
      } catch (error) {
        console.error("Error fetching WhatsApp config:", error);
      }

      try {
        // 3. Database Cleanup Stats
        const statsRes = await axiosInstance.get("/admin/settings/cleanup-stats");
        if (statsRes.data.success && statsRes.data.data) {
          setCleanupStats(statsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching cleanup stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsData();
  }, []);

  const fetchCleanupStats = async () => {
    try {
      setIsCleaning(true);
      const statsRes = await axiosInstance.get("/admin/settings/cleanup-stats");
      if (statsRes.data.success && statsRes.data.data) {
        setCleanupStats(statsRes.data.data);
        toast.success("Cleanup stats refreshed");
      }
    } catch (error) {
      toast.error("Failed to refresh stats");
    } finally {
      setIsCleaning(false);
    }
  };

  const handleCleanCancelledOrders = async () => {
    if (cleanupStats.cancelledOrders === 0) {
      toast.success("No cancelled orders to clean");
      return;
    }
    if (!confirm(`Delete all ${cleanupStats.cancelledOrders} cancelled orders permanently?`)) return;

    try {
      setIsCleaning(true);
      const res = await axiosInstance.delete("/admin/orders/cleanup/cancelled");
      if (res.data.success) {
        toast.success(res.data.message || "Cancelled orders cleaned!");
        setCleanupStats((prev) => ({ ...prev, cancelledOrders: 0 }));
      }
    } catch (error: any) {
      toast.error("Failed to clean cancelled orders");
    } finally {
      setIsCleaning(false);
    }
  };

  const handleCleanClosedInquiries = async () => {
    if (cleanupStats.closedInquiries === 0) {
      toast.success("No closed inquiries to clean");
      return;
    }
    if (!confirm(`Delete all ${cleanupStats.closedInquiries} closed inquiries permanently?`)) return;

    try {
      setIsCleaning(true);
      const res = await axiosInstance.delete("/admin/inquiries/cleanup/closed");
      if (res.data.success) {
        toast.success(res.data.message || "Closed inquiries cleaned!");
        setCleanupStats((prev) => ({ ...prev, closedInquiries: 0 }));
      }
    } catch (error: any) {
      toast.error("Failed to clean closed inquiries");
    } finally {
      setIsCleaning(false);
    }
  };

  const handleCleanNotifications = async () => {
    if (cleanupStats.totalNotifications === 0) {
      toast.success("No notifications to clean");
      return;
    }
    if (!confirm(`Clear all ${cleanupStats.totalNotifications} notification logs?`)) return;

    try {
      setIsCleaning(true);
      await axiosInstance.put("/admin/notifications/clear-all");
      toast.success("All notifications cleared!");
      setCleanupStats((prev) => ({ ...prev, totalNotifications: 0 }));
    } catch (error: any) {
      toast.error("Failed to clear notifications");
    } finally {
      setIsCleaning(false);
    }
  };

  const handleMasterPurge = async () => {
    if (
      !confirm(
        "Are you sure you want to purge all cancelled orders, closed inquiries, and notifications in one click?"
      )
    )
      return;

    try {
      setIsCleaning(true);
      const res = await axiosInstance.post("/admin/settings/purge-unwanted");
      if (res.data.success) {
        toast.success("All unwanted records purged successfully!");
        setCleanupStats({
          cancelledOrders: 0,
          closedInquiries: 0,
          totalNotifications: 0,
        });
      }
    } catch (error: any) {
      toast.error("Failed to purge unwanted records");
    } finally {
      setIsCleaning(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put("/admin/settings/profile", profileForm);
      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please provide both current and new passwords.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axiosInstance.put("/admin/settings/password", passwordForm);
      if (response.data.success) {
        toast.success("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "" });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handlePreferenceToggle = async () => {
    try {
      const newPref = { ...preferences, emailNotifications: !preferences.emailNotifications };
      const response = await axiosInstance.put("/admin/settings/preferences", newPref);
      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  const handleWhatsAppToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked;
    setWhatsAppForm(prev => ({ ...prev, isEnabled: newStatus }));
    try {
      const res = await axiosInstance.put("/admin/config/whatsapp", {
        ...whatsAppForm,
        isEnabled: newStatus
      });
      if (res.data.success) {
        toast.success(newStatus ? "WhatsApp icon enabled on store!" : "WhatsApp icon disabled on store!");
      }
    } catch (error: any) {
      console.error("Failed to toggle WhatsApp icon:", error);
      toast.error(error.response?.data?.message || "Failed to update toggle status");
    }
  };

  const handleWhatsAppUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingWhatsApp(true);
      const res = await axiosInstance.put("/admin/config/whatsapp", whatsAppForm);
      if (res.data.success) {
        toast.success("WhatsApp settings updated & live on store!");
      }
    } catch (error: any) {
      console.error("Failed to update WhatsApp settings:", error);
      toast.error(error.response?.data?.message || "Failed to update WhatsApp settings");
    } finally {
      setIsSavingWhatsApp(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && profile) {
      const formData = new FormData();
      formData.append("avatar", e.target.files[0]);

      try {
        const response = await axiosInstance.put(
          "/admin/settings/avatar",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.data.success) {
          updateUser(response.data.data);
          toast.success("Avatar updated successfully!");
        }
      } catch (error: any) {
        console.error("Failed to update avatar:", error);
        toast.error(error.response?.data?.message || "Failed to update avatar");
      }
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      if (logout) {
        await logout();
      } else {
        localStorage.removeItem("adminToken"); 
      }
      toast.success("Logged out successfully");
      window.location.href = "/admin/login"; 
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const getAvatarUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const apiURL = axiosInstance.defaults.baseURL || 'http://localhost:5000/api';
    const backendURL = apiURL.replace(/\/api$/, '');
    return `${backendURL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Preview target URL
  const cleanPhone = whatsAppForm.phoneNumber.replace(/[^0-9]/g, "");
  const previewWhatsAppUrl = whatsAppForm.customUrl.trim() 
    ? whatsAppForm.customUrl.trim()
    : `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsAppForm.message)}`;

  return (
    <>
      <DashboardLayout>
        <div className={styles.header}>
          <h1 className={styles.title}>Store & Account Settings</h1>
          <p className={styles.subtitle}>Manage your profile, security, WhatsApp floating chat, and preferences</p>
        </div>

        <div className={styles.grid}>
          {/* Left Column */}
          <div className={styles.column}>
            {/* Profile Info */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <User size={20} />
                <h3>Profile Information</h3>
              </div>
              
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  {profile?.avatar ? (
                    <img 
                      src={getAvatarUrl(profile.avatar) as string} 
                      alt={profile.name} 
                      className={styles.avatarImg}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <User size={40} />
                    </div>
                  )}
                  <label htmlFor="avatar-upload" className={styles.cameraBtn}>
                    <Camera size={14} />
                  </label>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    className={styles.hiddenInput}
                  />
                </div>
                <div>
                  <h4 className={styles.profileName}>{profile?.name || "Admin User"}</h4>
                  <p className={styles.profileRole}>{profile?.role || "Administrator"}</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={profileForm.name} 
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={profileForm.email} 
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isProfileUnchanged} 
                  className={styles.submitBtn}
                >
                  <Save size={16} /> Save Profile Changes
                </button>
              </form>
            </section>

            {/* Change Password */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Lock size={20} />
                <h3>Change Password</h3>
              </div>
              <form onSubmit={handlePasswordChange} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.currentPassword} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword} 
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  <Save size={16} /> Update Password
                </button>
              </form>
            </section>
          </div>

          {/* Right Column */}
          <div className={styles.column}>
            {/* 💬 WhatsApp Chat Widget Settings */}
            <section className={styles.section} style={{ borderTop: "3px solid #25D366" }}>
              <div className={styles.sectionHeader}>
                <MessageCircle size={20} color="#25D366" />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "8px" }}>
                  <h3>WhatsApp Floating Chat</h3>
                  <span className={styles.whatsAppBadge}>
                    Right-Center Floating Icon
                  </span>
                </div>
              </div>

              <form onSubmit={handleWhatsAppUpdate} className={styles.form}>
                <div className={styles.preferenceItem} style={{ padding: "0 0 1rem 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <p className={styles.prefLabel}>Enable Floating Icon</p>
                    <p className={styles.prefDesc}>Show WhatsApp chat button on all store pages</p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={whatsAppForm.isEnabled} 
                      onChange={handleWhatsAppToggle} 
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label>WhatsApp Phone Number (with Country Code)</label>
                  <input 
                    type="text" 
                    value={whatsAppForm.phoneNumber} 
                    onChange={(e) => setWhatsAppForm({ ...whatsAppForm, phoneNumber: e.target.value })}
                    placeholder="e.g. 919876543210 (without + or spaces)"
                    required
                  />
                  <small>
                    Include country code (e.g. <strong>91</strong> for India followed by 10-digit number).
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label>Default Pre-filled Message</label>
                  <textarea 
                    value={whatsAppForm.message} 
                    onChange={(e) => setWhatsAppForm({ ...whatsAppForm, message: e.target.value })}
                    rows={2}
                    placeholder="e.g. Hello ACI Agro Solutions, I would like to inquire about your products."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Direct Custom WhatsApp URL (Optional)</label>
                  <input 
                    type="url" 
                    value={whatsAppForm.customUrl} 
                    onChange={(e) => setWhatsAppForm({ ...whatsAppForm, customUrl: e.target.value })}
                    placeholder="https://wa.me/919876543210?text=..."
                  />
                  <small>
                    Leave empty to automatically generate from number and message above.
                  </small>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  <button 
                    type="submit" 
                    disabled={isSavingWhatsApp} 
                    className={styles.saveWhatsAppBtn}
                  >
                    <Save size={16} /> {isSavingWhatsApp ? "Saving..." : "Save WhatsApp Settings"}
                  </button>

                  <a
                    href={previewWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.testChatBtn}
                  >
                    <ExternalLink size={15} /> Test Chat Link
                  </a>
                </div>
              </form>
            </section>

            {/* 🧹 Database & Table Maintenance Hub */}
            <section className={`${styles.section} ${styles.cleanupHub}`}>
              <div className={styles.sectionHeader}>
                <Database size={20} color="#0284c7" />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <h3>Database & Table Maintenance</h3>
                  <button
                    type="button"
                    onClick={fetchCleanupStats}
                    disabled={isCleaning}
                    style={{ background: "none", border: "none", color: "#0284c7", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", fontWeight: 600 }}
                  >
                    <RefreshCw size={13} className={isCleaning ? "animate-spin" : ""} /> Refresh
                  </button>
                </div>
              </div>

              <p style={{ fontSize: "0.84rem", color: "#64748b", margin: "0 0 14px 0" }}>
                Remove cancelled orders, closed inquiries, and old records to keep your dashboard clean and fast.
              </p>

              <div className={styles.cleanupGrid}>
                {/* 1. Cancelled Orders */}
                <div className={styles.cleanupItem}>
                  <div className={styles.cleanupInfo}>
                    <h4>
                      Cancelled Orders
                      <span className={styles.cleanupCount}>{cleanupStats.cancelledOrders}</span>
                    </h4>
                    <p>Permanently removes all orders with 'Cancelled' status</p>
                  </div>
                  <button
                    type="button"
                    className={styles.cleanupItemBtn}
                    onClick={handleCleanCancelledOrders}
                    disabled={isCleaning || cleanupStats.cancelledOrders === 0}
                  >
                    <Trash2 size={13} /> Clean
                  </button>
                </div>

                {/* 2. Closed Inquiries */}
                <div className={styles.cleanupItem}>
                  <div className={styles.cleanupInfo}>
                    <h4>
                      Closed Inquiries
                      <span className={styles.cleanupCount}>{cleanupStats.closedInquiries}</span>
                    </h4>
                    <p>Purges processed & closed bulk customer inquiries</p>
                  </div>
                  <button
                    type="button"
                    className={styles.cleanupItemBtn}
                    onClick={handleCleanClosedInquiries}
                    disabled={isCleaning || cleanupStats.closedInquiries === 0}
                  >
                    <Trash2 size={13} /> Clean
                  </button>
                </div>

                {/* 3. Notifications */}
                <div className={styles.cleanupItem}>
                  <div className={styles.cleanupInfo}>
                    <h4>
                      Old Notifications
                      <span className={styles.cleanupCount}>{cleanupStats.totalNotifications}</span>
                    </h4>
                    <p>Clears all notification logs from the dashboard</p>
                  </div>
                  <button
                    type="button"
                    className={styles.cleanupItemBtn}
                    onClick={handleCleanNotifications}
                    disabled={isCleaning || cleanupStats.totalNotifications === 0}
                  >
                    <Trash2 size={13} /> Clean
                  </button>
                </div>
              </div>

              <button
                type="button"
                className={styles.masterPurgeBtn}
                onClick={handleMasterPurge}
                disabled={
                  isCleaning ||
                  (cleanupStats.cancelledOrders === 0 &&
                    cleanupStats.closedInquiries === 0 &&
                    cleanupStats.totalNotifications === 0)
                }
              >
                <Sparkles size={16} /> Purge All Unwanted Records
              </button>
            </section>

            {/* Notifications */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <Bell size={20} />
                <h3>Notifications</h3>
              </div>
              <div className={styles.preferenceItem}>
                <div>
                  <p className={styles.prefLabel}>Email Notifications</p>
                  <p className={styles.prefDesc}>Get updates about orders and stock</p>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={preferences?.emailNotifications || false} 
                    onChange={handlePreferenceToggle} 
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </section>

            {/* Account Actions (Logout) Section */}
            <section className={`${styles.section} ${styles.dangerZone}`}>
              <div className={styles.sectionHeader} style={{ borderBottomColor: '#fee2e2' }}>
                <LogOut size={20} color="#dc2626" />
                <h3 style={{ color: '#dc2626' }}>Account Actions</h3>
              </div>
              <div className={styles.preferenceItem}>
                <div>
                  <p className={styles.prefLabel}>Log Out</p>
                  <p className={styles.prefDesc}>End your current admin session securely.</p>
                </div>
                <button 
                  onClick={() => setShowLogoutModal(true)} 
                  className={styles.logoutBtn}
                >
                  Logout
                </button>
              </div>
            </section>
          </div>
        </div>
      </DashboardLayout>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              <LogOut size={32} color="#dc2626" />
            </div>
            <h3>Ready to Leave?</h3>
            <p>Are you sure you want to log out of your admin dashboard? You will need to log in again to access the panel.</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmBtn} 
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}