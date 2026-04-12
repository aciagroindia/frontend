"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Naya Import
import { useAuth } from "../../context/AuthContext"; // ✅ Auth Context Import (Path check kar lena)
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 👇 --- SECURITY GUARD LOGIC START --- 👇
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jab loading khatam ho jaye, tab checking shuru karo
    if (!loading) {
      if (!isAuthenticated) {
        // Bina login wale ko admin login par bhejo
        router.push("/admin/login");
      } else if (user?.role !== 'admin' && user?.role !== 'owner') {
        // Normal user ko home par bhejo
        router.push("/");
      }
    }
  }, [isAuthenticated, loading, user, router]);

  // Jab tak verification chal raha hai, tab tak layout render mat hone do
  if (loading || !isAuthenticated || (user?.role !== 'admin' && user?.role !== 'owner')) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          {/* Custom Spinner */}
          <div style={{ width: '45px', height: '45px', border: '4px solid #cbd5e1', borderTopColor: '#1a8e5f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <h3 style={{ color: '#475569', fontFamily: 'sans-serif', margin: 0 }}>Verifying Access...</h3>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }
  // 👆 --- SECURITY GUARD LOGIC END --- 👆

  return (
    <div className={styles.container}>
      
      <Sidebar 
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className={styles.main}>
        <Header toggleSidebar={() => setIsSidebarOpen((prev)=>!prev)} />

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}