import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agri-Connect - Connecting Farmers with Partners",
  description: "A platform connecting agricultural producers with business partners for direct trade, fair pricing, and sustainable farming partnerships.",
  keywords: "agriculture, farming, direct trade, agricultural marketplace, farmer platform",
  authors: [{ name: "Agri-Connect Team" }],
  openGraph: {
    title: "Agri-Connect - Connecting Farmers with Partners",
    description: "A platform connecting agricultural producers with business partners for direct trade, fair pricing, and sustainable farming partnerships.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agri-Connect - Connecting Farmers with Partners",
    description: "A platform connecting agricultural producers with business partners for direct trade, fair pricing, and sustainable farming partnerships.",
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
