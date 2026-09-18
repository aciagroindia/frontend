import type { Metadata } from "next";
import Login from "../../../../components/login/login";

export const metadata: Metadata = {
  title: "Login | ACI Agro Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <Login />;
}