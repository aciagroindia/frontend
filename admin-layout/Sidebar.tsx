"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Megaphone,
  ChevronDown,
  LucideIcon,
  X,
  ClipboardList,
} from "lucide-react";
import styles from "./Sidebar.module.css";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: {
    name: string;
    href: string;
  }[];
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Categories", href: "/admin/category", icon: Package },
  {
    name: "Marketing", // FIX: Changed href to be more specific
    href: "/admin/marketing",
    icon: Megaphone,
    children: [
      { name: "Hero Banners", href: "/admin/marketing/hero-banners" },
      { name: "Discounts", href: "/admin/marketing/discounts" },
      { name: "Coupons", href: "/admin/marketing/coupons" },
      { name: "Certificates", href: "/admin/marketing/certificates" },
      { name: "About Media", href: "/admin/marketing/about-media" },
    ],
  },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Bulk Orders", href: "/admin/bulk-inquiries", icon: ClipboardList },
];

export default function Sidebar({
  isOpen,
  closeSidebar,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
}) {
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const pathname = usePathname();

  useEffect(() => {
    const parent = NAV_ITEMS.find((item) =>
      item.children?.some((child) => pathname.startsWith(child.href))
    );

    if (parent && !openSubmenus[parent.name]) {
      setOpenSubmenus((prev) => ({ ...prev, [parent.name]: true }));
    }
  }, [pathname, openSubmenus]);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.top}>
        <h2 className={styles.logo}> ACI </h2>
        <button
          className={styles.closeBtn}
          onClick={closeSidebar}
          aria-label="Close Menu"
        >
          <X size={22} />
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            // FIX: More robust check for parent active state
            const isParentActive = item.children.some((child) => pathname.startsWith(child.href));

            const isSubmenuOpen = openSubmenus[item.name] || false;

            return (
              <div key={item.name}>
                <button
                  className={`${styles.navLink} ${isParentActive ? styles.active : ""
                    }`}
                  onClick={() => toggleSubmenu(item.name)}
                  aria-expanded={isSubmenuOpen}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>

                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${isSubmenuOpen ? styles.chevronOpen : ""
                      }`}
                  />
                </button>

                {isSubmenuOpen && (
                  <div className={styles.submenu}>
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeSidebar}
                          className={`${styles.submenuLink} ${isChildActive ? styles.active : ""
                            }`}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`${styles.navLink} ${isActive ? styles.active : ""
                }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}