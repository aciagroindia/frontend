"use client";

import { Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <button
        className={styles.menuBtn}
        onClick={toggleSidebar}
        aria-label="Open Menu"
      >
        <Menu size={22} />
      </button>

      <div />

      <div className={styles.right}>
        <div className={styles.notificationWrapper}>
          <button
            className={styles.actionBtn}
            onClick={() => router.push("/admin/notifications")}
          >
            <div className={styles.notificationBadge}></div>
            <Bell size={20} />
          </button>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.user}>
          <div className={styles.avatarWrapper}>
            <img
              src={user?.avatar || "https://i.pravatar.cc/40"}
              alt="Admin Profile"
              className={styles.avatar}
              key={user?.avatar}
            />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || "Admin"}</span>
            <span className={styles.userRole}>{user?.role === 'owner' ? "Super Admin" : "Admin"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}