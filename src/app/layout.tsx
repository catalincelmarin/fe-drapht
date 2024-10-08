import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google"; // Import both fonts
import "./globals.css";

// Use Roboto font
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"], // Specify the weights you need
});

// Use Roboto Mono for monospace
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  weight: ["400", "500", "700"], // Monospace font weights
});

export const metadata: Metadata = {
  title: "DraphtBotz",
  description: "NEXTJs app generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased custom-scrollbar`}
      >
        {children}
      </body>
    </html>
  )}