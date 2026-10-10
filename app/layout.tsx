import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import ToastProvider from "./components/toast-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["bengali"],
});

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "বাজার দর — প্রতিদিনের বাজারদর",
  description: "প্রতিদিনের পণ্যের বাজারদর ও মূল্য পরিবর্তন দেখুন।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} ${notoSerifBengali.variable} h-full scroll-smooth antialiased`}
    >
      <body
        className="min-h-screen flex flex-col bg-[#f7faf7] font-bengali text-bazaar-ink"
        suppressHydrationWarning
      >
        <ToastProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <div className="flex-grow">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
