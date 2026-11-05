import type { Metadata } from "next";
import Login from "../../../../components/login/login"; 

export const metadata: Metadata = {
  title: "Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <Login />;
}
