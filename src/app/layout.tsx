import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // 1. Toast import kiya

import { CartProvider } from "../../context/CartContext";
import { WishlistProvider } from "../../context/WishlistContext";
import { AuthProvider } from "../../context/AuthContext"; // 1. AuthProvider import karein
import { ProductProvider } from "../../context/ProductContext";
import { CategoryProvider } from "../../context/CategoryContext";
import ConditionalLayout from "../../components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  metadataBase: new URL("https://aciagro.com"),
  title: "Aci Agro Solutions",
  description: "Authentic Ayurvedic products for your well-being.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            function loadGA() {
              if (window.gaLoaded) return;
              window.gaLoaded = true;
              var s = document.createElement('script');
              s.src = "https://www.googletagmanager.com/gtag/js?id=G-XENSPV6GWS";
              s.async = true;
              document.head.appendChild(s);

              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XENSPV6GWS');
            }
            ['scroll', 'touchstart', 'mousemove', 'click', 'keydown'].forEach(function(e) {
              window.addEventListener(e, loadGA, { once: true, passive: true });
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* 2. Toaster add kiya - Isse UI change nahi hoga, sirf popups dikhenge */}
        <Toaster 
          position="bottom-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 2000, // 2 second tak dikhega
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <AuthProvider> {/* 2. AuthProvider se sabko wrap karein */}
          <CategoryProvider>
            <ProductProvider>
              <CartProvider>
                <WishlistProvider>
                  <ConditionalLayout>
                    {children}
                  </ConditionalLayout>
                </WishlistProvider>
              </CartProvider>
            </ProductProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}