"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import { User, Lock, Bell, Camera, Save } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "react-hot-toast";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const { user: profile, updateUser } = useAuth();
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [isProfileUnchanged, setIsProfileUnchanged] = useState(true);

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
    const fetchPreferences = async () => {
      try {
        const prefRes = await axiosInstance.get("/admin/settings/preferences");
        if (prefRes.data.success) {
          setPreferences(prefRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

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

// Helper function: axiosInstance ka base URL use karke image URL banayega
  const getAvatarUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    
    // axiosInstance se current base URL uthao (e.g., 'https://aci-agro.onrender.com/api' ya localhost)
    const apiURL = axiosInstance.defaults.baseURL || 'http://localhost:5000/api';
    
    // '/api' ko hata do taaki main server ka URL mil jaye
    const backendURL = apiURL.replace(/\/api$/, '');
    
    return `${backendURL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Settings</h1>
        <p className={styles.subtitle}>Manage your profile, security, and preferences</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.column}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <User size={20} />
              <h3>Profile Information</h3>
            </div>
            
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {/* 👇 Yahan par Main Changes kiye hain 👇 */}
                {profile?.avatar ? (
                  <img 
                    src={getAvatarUrl(profile.avatar) as string} 
                    alt={profile.name} 
                    className={styles.avatar} 
                  />
                ) : (
                  <div className={styles.defaultAvatar}>
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
                {/* 👆 End of Main Changes 👆 */}
                
                <label className={styles.changeAvatar} title="Change Photo">
                  <Camera size={16} />
                  <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
              <div className={styles.avatarInfo}>
                <h4>{profile?.name}</h4>
                <p>{profile?.role === 'owner' ? "Super Admin Access" : "Admin access"}</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleProfileUpdate}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profileForm.name} 
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={profileForm.email} 
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} 
                />
              </div>
              <button type="submit" className={styles.saveBtn} disabled={isProfileUnchanged}>
                <Save size={18} /> Update Profile
              </button>
            </form>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Lock size={20} />
              <h3>Security & Password</h3>
            </div>
            <form className={styles.form} onSubmit={handlePasswordChange}>
              <div className={styles.inputGroup}>
                <label>Current Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="Min. 6 characters" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
              <button type="submit" className={styles.saveBtn} disabled={!passwordForm.currentPassword || !passwordForm.newPassword}>
                <Save size={18} /> Change Password
              </button>
            </form>
          </section>
        </div>

        <div className={styles.column}>
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
        </div>
      </div>
    </DashboardLayout>
  );
}