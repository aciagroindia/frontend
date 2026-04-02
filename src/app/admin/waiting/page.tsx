"use client";

import { useAuth } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Clock, RefreshCw, LogOut } from "lucide-react";

export default function WaitingPage() {
  const { user, refreshUserStatus, logout } = useAuth();
  const router = useRouter();

  // Agar approve ho gaya toh dashboard bhej do
  useEffect(() => {
    if (user?.isAdminApproved) {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '20px' }}>
      <Clock size={60} color="#f59e0b" style={{ marginBottom: '20px' }} />
      <h1>Approval Pending</h1>
      <p>Hello {user?.name}, aapki request Owner ke paas hai.</p>
      <p>Approve hone ke baad aap admin panel access kar payenge.</p>
      
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => refreshUserStatus()} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          <RefreshCw size={18} /> Check Status
        </button>
        
        <button 
          onClick={logout} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}