"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import AdvancedTable from "../../../../components/admin-ui/AdvancedTable";
import { Mail } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./CustomersPage.module.css";

// Interface for Type Safety
interface Customer {
  id: string;
  name: string;
  email: string;
  orders: string;
  role?: 'user' | 'admin' | 'owner'; // Role ko track karne ke liye
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/admin/users");
        if (response.data.success) {
          // Sirf un users ko dikhayein jinka role 'user' hai
          const actualCustomers = response.data.data.filter(
            (user: Customer) => user.role === 'user'
          );
          setCustomers(actualCustomers);
        }
      } catch (error) {
        console.error("Error fetching admin customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);
  
  const columns = [
    { 
      key: "name", 
      label: "Customer Name",
      render: (val: string) => <span className={styles.userName}>{val}</span>
    },
    { 
      key: "email", 
      label: "Email Address",
      render: (val: string) => (
        <a href={`mailto:${val}`} className={styles.emailLink}>
          <Mail size={14} /> {val}
        </a>
      )
    },
    { 
      key: "orders", 
      label: "Total Orders",
      render: (val: string) => <span className={styles.orderBadge}>{val || 0} Orders</span>
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.tableWrapper}>
          <div className={styles.loadingState}>Loading customers...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.subtitle}>View and manage your registered users</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <AdvancedTable
          columns={columns}
          data={customers}
        />
      </div>

    </DashboardLayout>
  );
}
