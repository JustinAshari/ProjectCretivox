// src/app/layout.js
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit-local",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif-local",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "THE FLOW // A Creative Frontend Journey by Emily Johnson",
  description: "An interactive, clean aquatic frontend portfolio showcasing GSAP scroll triggers, fluid micro-animations, and storytelling, built for the Cretivox Endurance Test.",
  keywords: ["Cretivox", "Endurance Test", "Frontend Developer", "GSAP Animations", "Creative Portfolio", "Web Developer", "Interactive Design"],
  authors: [{ name: "Emily Johnson" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Floating background ambient currents */}
        <div className="ambient-bg">
          <div className="wave-element wave-1"></div>
          <div className="wave-element wave-2"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
