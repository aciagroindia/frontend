"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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