import type { Metadata } from "next";
import { Suspense } from "react";
import SignupPage from "../../../../components/signUP/signUp";

export const metadata: Metadata = {
  title: "Create Account | ACI Agro Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupRoute() {
  return (
    <Suspense fallback={null}>
      <SignupPage />
    </Suspense>
  );
}
