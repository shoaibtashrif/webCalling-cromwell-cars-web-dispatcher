import type { Metadata } from "next";
import Image from 'next/image';
import UVLogo from '@/public/UVHorizontal-White.svg';
import "./globals.css";

export const metadata: Metadata = {
  title: "NetTech Ltd - AI Taxi Booking",
  description: "Book your taxi with NetTech Ltd's advanced AI voice assistant. Natural conversation, instant booking, real-time tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script src="https://cdn.usefathom.com/script.js" data-site="ONYOCTXK" defer></script>
        {/* <!-- / Fathom --> */}
      </head>
      <body className="bg-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
