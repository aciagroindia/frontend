"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== 'admin' || !user?.isAdminApproved) {
        router.push("/admin/waiting");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || !user?.isAdminApproved) return <div>Loading...</div>;
  return <>{children}</>;
}