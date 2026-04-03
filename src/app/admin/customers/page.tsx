"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../../../../components/admin-layout/DashboardLayout";
import AdvancedTable from "../../../../components/admin-ui/AdvancedTable";
import { Mail } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import styles from "./CustomersPage.module.css";

// Interface for Type Safety (Connected with MongoDB Schema)
interface Customer {
  _id: string; // MongoDB se '_id' aata hai
  name: string;
  email: string;
  phone?: string; // Apna User model check kar lena ki ye 'phone' hai ya kuch aur
  role?: 'user' | 'admin' | 'owner'; 
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Backend aapka '/admin/users' (ya /api/admin/users) par hit hoga
        const response = await axiosInstance.get("/admin/users");
        
        if (response.data.success) {
          // Sirf normal users filter kar rahe hain
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
  
  // Table Columns Setup
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
      key: "phone", // ⚠️ Ensure this matches your MongoDB User schema field (e.g., 'phone' or 'mobile')
      label: "Mobile Number",
      render: (val: string) => (
        <span className={styles.orderBadge}>
          {val ? val : "N/A"}
        </span>
      )
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
          // Agar AdvancedTable component ko specific 'id' prop chahiye hota hai, 
          // toh aap map karke id: user._id bhi de sakte ho, par zyada tar tables _id ko handle kar leti hain.
          data={customers} 
        />
      </div>

    </DashboardLayout>
  );
}