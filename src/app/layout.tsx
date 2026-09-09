import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import Script from "next/script";
import { RegisterSW } from "@/components/app/RegisterSW";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plan PortAventura",
  description:
    "Itinerario y colas para PortAventura 20–22 septiembre 2026. PWA para el teléfono.",
  applicationName: "Plan PortAventura",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PA Plan",
  },
  formatDetection: { telephone: false },
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#134e4a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <Script src="/kill-sw.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-dvh flex flex-col">
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
