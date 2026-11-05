import type { Metadata } from "next";
import Login from "../../../../components/login/login";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <Login />;
}
