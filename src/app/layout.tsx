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

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://aciagro.com"),
  title: {
    default: "ACI Agro Solutions - Pure Ayurvedic & Herbal Wellness",
    template: "%s | ACI Agro Solutions",
  },
  description: "Shop 100% natural, pure Ayurvedic herbal wellness products, juices, and organic remedies online at best prices across India with ACI Agro Solutions.",
  keywords: [
    "Ayurvedic products",
    "Herbal wellness",
    "ACI Agro Solutions",
    "Buy Ayurvedic medicine online",
    "Natural health remedies",
    "Organic Ayurvedic products India"
  ],
  authors: [{ name: "ACI Agro Solutions" }],
  creator: "ACI Agro Solutions",
  publisher: "ACI Agro Solutions",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://aciagro.com",
    siteName: "ACI Agro Solutions",
    title: "ACI Agro Solutions - Pure Ayurvedic & Herbal Wellness",
    description: "Shop 100% natural, pure Ayurvedic herbal wellness products, juices, and organic remedies online at best prices across India with ACI Agro Solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACI Agro Solutions - Pure Ayurvedic & Herbal Wellness",
    description: "Shop 100% natural, pure Ayurvedic herbal wellness products, juices, and organic remedies online at best prices across India with ACI Agro Solutions.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="description"
          content="Shop 100% natural, pure Ayurvedic herbal wellness products, juices, and organic remedies online at best prices across India with ACI Agro Solutions."
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XENSPV6GWS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-XENSPV6GWS');
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