import type { Metadata } from "next";
import { Lato, Comfortaa } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import { ReactNode } from "react";
import { OG_IMAGE, SITE_DOMAIN } from "@/config/metadata";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Sidebar from "@/components/Sidebar/Sidebar";
import AuthInterceptor from "@/components/AuthInterceptor/AuthInterceptor";
import css from "./layout.module.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: "Лелека – Все про вагітність: поради, календар, щоденник",
  description:
    "Додаток «Лелека» допомагає майбутнім мамам та батькам стежити за розвитком малюка, отримувати корисні поради, вести щоденник вагітності та фіксувати важливі події.",
  openGraph: {
    title: "Лелека – Все про вагітність: поради, календар, щоденник",
    description:
      "Додаток «Лелека» допомагає майбутнім мамам та батькам стежити за розвитком малюка, отримувати корисні поради, вести щоденник вагітності та фіксувати важливі події.",
    url: SITE_DOMAIN,
    images: [OG_IMAGE],
    type: "website",
  },
};

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});
const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  display: "swap",
  weight: ["700"],
  subsets: ["latin"],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${comfortaa.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <AuthInterceptor />
            <Header />
            <div className={css.layout}>
              <div className={css.sidebarWrapper}>
                <Sidebar />
              </div>
              <main className={css.main}>
                <Breadcrumbs />
                {children}
              </main>
            </div>
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
