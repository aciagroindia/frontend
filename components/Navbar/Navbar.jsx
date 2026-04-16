"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import Image from "next/image";
import MegaMenu from "../../components/MegaMenu/MegaMenu";
import Cart from "../../components/Cart/cart";
import { useState, useEffect, useRef, useCallback } from "react";
import SearchMegaMenu from "../../components/SearchMenu/SearchMegaMenu";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../context/CategoryContext";

// 👇 YAHAN IMPORT ADD KIYA HAI (Aap apne path ke hisaab se adjust kar lena)
import TopAnnouncementBar from "../../components/TopAnnouncementBar/TopAnnouncementBar"; 

// Search input ke liye ek simple debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function Navbar() {
  const { isCartOpen, setIsCartOpen, cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { categories, loading: categoriesLoading } = useCategories();
  const { user, isAuthenticated, logout } = useAuth(); 
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const debouncedSearchTerm = useDebounce(searchTerm, 300); 
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("categories");
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false); 
  
  const searchContainerRef = useRef(null); 

  useEffect(() => {
    if (isMobileDrawerOpen || isMobileSearchOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileDrawerOpen, isMobileSearchOpen, isCartOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const closeDrawer = () => setIsMobileDrawerOpen(false);
  const closeSearch = useCallback(() => {
    setIsSearchMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, []);

  const closeMegaMenu = useCallback(() => {
    setIsMegaMenuOpen(false);
  }, []);

  return (
    <>
      <header className={styles.header}>
        {/* 👇 YAHAN COMPONENT ADD KIYA HAI - FIXED HEADER KE ANDAR */}
        <TopAnnouncementBar />

        <nav className={styles.navbar}>
          <button className={styles.hamburger} onClick={() => setIsMobileDrawerOpen(true)}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </button>

          <Link href="/" className={styles.logoLink}>
            <div className={styles.logo}>
              <Image src="/assets/Aci logo.png" alt="Logo" width={60} height={60} />
            </div>
          </Link>

          <div className={styles.menu}>
            <Link href="/" className={styles.menuItem}>Home</Link>
            <div 
              className={styles.shopArea}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link href="#" className={styles.menuItem} onClick={closeMegaMenu}>
                Shop
                <Image src="/assets/keyboad-arrowdown.svg" alt="" width={20} height={20} className={styles.subtleIcon} />
              </Link>
              {isMegaMenuOpen && <MegaMenu onLinkClick={closeMegaMenu} />}
            </div>
            <Link href="/orders" className={styles.menuItem}>Orders</Link>
            <Link href="/bulk-order" className={styles.menuItem}>Bulk Order</Link>
            <Link href="/about" className={styles.menuItem}>About</Link>
          </div>

          <div className={styles.iconGroup}>
            {/* Search */}
            <div 
              ref={searchContainerRef}
              className={`${styles.searchArea} ${styles.desktopSearch}`} 
              onFocus={() => setIsSearchMenuOpen(true)}
            >
              <div className={styles.search}>
                <Image src="/assets/search-icon.svg" alt="" width={20} height={20} className={styles.subtleIcon} />
                <input 
                  type="text" 
                  placeholder="I'm looking for..." 
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              {isSearchMenuOpen && <SearchMegaMenu searchTerm={debouncedSearchTerm} onResultClick={closeSearch} />}
            </div>

            {/* Mobile search button */}
            <button className={`${styles.iconBtn} ${styles.mobileSearchBtn}`} onClick={() => setIsMobileSearchOpen(true)}>
              <Image src="/assets/search-icon.svg" alt="Search" width={20} height={20} className={styles.darkIcon} />
            </button>

            {/* Login/User Logic - DESKTOP */}
            {isAuthenticated ? (
              <div className={styles.userContainer} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={styles.userName} style={{ fontSize: '14px', fontWeight: '500' }}>
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <button onClick={logout} className={styles.iconBtn} title="Logout">
                  <Image src="/assets/User.svg" alt="Logout" width={20} height={20} style={{ filter: 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' }} />
                </button>
              </div>
            ) : (
              <Link href="/login" className={`${styles.iconBtn} ${styles.loginIcon}`}>
                <Image src="/assets/User.svg" alt="User" width={20} height={20} />
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/Whichlist" className={styles.iconBtn} style={{ position: "relative" }}>
              <Image src="/assets/favourite-icon.svg" alt="Wishlist" width={20} height={20} className={styles.brightIcon} />
              {wishlist.length > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px', background: '#1a8e5f', color: 'white',
                  fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} className={styles.iconBtn} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, position: 'relative' }}>
              <Image src="/assets/cart.svg" alt="Cart" width={20} height={20} />
              {cartItems.length > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px', background: '#1a8e5f', color: 'white',
                  fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Drawer Overlay */}
      <div className={`${styles.drawerOverlay} ${isMobileDrawerOpen ? styles.overlayOpen : ""}`} onClick={closeDrawer} />

      {/* Mobile Drawer Panel */}
      <div className={`${styles.mobileDrawer} ${isMobileDrawerOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <button onClick={closeDrawer} className={styles.closeBtn}>
            <Image src="/assets/Close.svg" alt="Close" width={24} height={24} />
          </button>
        </div>

        <div className={styles.drawerTabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === "menu" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            Menu
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "categories" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
        </div>

        <div className={styles.drawerContent}>
          {activeTab === "menu" && (
            <div className={styles.tabPane}>
              <Link href="/" className={styles.drawerLink} onClick={closeDrawer}>Home</Link>
              <Link href="/orders" className={styles.drawerLink} onClick={closeDrawer}>Orders</Link>
              <Link href="/bulk-order" className={styles.drawerLink} onClick={closeDrawer}>Bulk Order</Link>
              <Link href="/about" className={styles.drawerLink} onClick={closeDrawer}>About</Link>
              
              {/* Mobile Login/Logout Toggle */}
              {isAuthenticated ? (
                <>
                  <div className={styles.drawerLink} style={{ color: '#1a8e5f', fontWeight: 'bold' }}>
                    Welcome, {user?.name}
                  </div>
                  <button 
                    className={styles.drawerLink} 
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', color: 'red' }}
                    onClick={() => { logout(); closeDrawer(); }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className={styles.drawerLink} onClick={closeDrawer}>Login / Register</Link>
              )}
            </div>
          )}

          {activeTab === "categories" && (
            <div className={styles.tabPane}>
              {categoriesLoading ? (
                <span className={styles.drawerLink}>Loading...</span>
              ) : (
                categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/collections/${cat.slug}`}
                    className={styles.drawerLink}
                    onClick={closeDrawer}
                  >
                    {cat.name}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Panel */}
      <div className={`${styles.mobileSearchPanel} ${isMobileSearchOpen ? styles.panelOpen : ""}`}>
        <div className={styles.mobileSearchHeader}>
          <div className={styles.mobileSearchInputWrapper}>
            <div className={styles.search}>
              <Image src="/assets/search-icon.svg" alt="" width={20} height={20} className={styles.subtleIcon} />
              <input 
                type="text" 
                placeholder="I'm looking for..." 
                className={styles.searchInput} 
                autoFocus 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <button onClick={closeSearch} className={styles.closeBtn}>&times;</button>
        </div>
        <div className={styles.mobileSearchContent}>
          <SearchMegaMenu searchTerm={debouncedSearchTerm} onResultClick={closeSearch} />
        </div>
      </div>
    </>
  );
}