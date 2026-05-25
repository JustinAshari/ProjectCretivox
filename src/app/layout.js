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
  title: "THE FLOW // A Creative Frontend Journey by Justin Farrel Hazza Ashari",
  description: "An interactive, clean aquatic frontend portfolio showcasing GSAP scroll triggers, fluid micro-animations, and storytelling, built for the Cretivox Endurance Test.",
  keywords: ["Cretivox", "Endurance Test", "Frontend Developer", "GSAP Animations", "Creative Portfolio", "Web Developer", "Interactive Design"],
  authors: [{ name: "Justin Farrel Hazza Ashari" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning>
        {/* Floating background ambient currents & caustics */}
        <div className="ambient-bg">
          <div className="wave-element wave-1"></div>
          <div className="wave-element wave-2"></div>
          <div className="underwater-caustics"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
