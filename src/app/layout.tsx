import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // 1. Toast import kiya

import { CartProvider } from "../../context/CartContext";
import { WishlistProvider } from "../../context/WishlistContext";
import { AuthProvider } from "../../context/AuthContext"; // 1. AuthProvider import karein
import { ProductProvider } from "../../context/ProductContext";
import { CategoryProvider } from "../../context/CategoryContext";
import ConditionalLayout from "../../components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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