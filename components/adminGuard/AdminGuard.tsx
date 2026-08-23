"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const role = (user?.role || '').toLowerCase();
  const hasAccess = role === 'admin' || role === 'owner' || Boolean(user?.isAdminApproved);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/admin/login");
        return;
      }
      if (!hasAccess) {
        router.push("/admin/waiting");
      }
    }
  }, [loading, isAuthenticated, hasAccess, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || !hasAccess) return null;
  return <>{children}</>;
}