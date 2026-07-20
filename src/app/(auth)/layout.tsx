import FooterSection from "@/src/components/FooterSection/FooterSection";
import Header from "@/src/components/Header/Header";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <FooterSection />
    </>
  );
}
