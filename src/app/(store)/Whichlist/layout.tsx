import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | ACI Agro Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
