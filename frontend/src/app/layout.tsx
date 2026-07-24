import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Geist vía next/font/local: la fuente vive en src/app/fonts, servida por
// Next sin request de red. La variable CSS --font-geist-sans queda disponible
// para usar en cualquier clase de Tailwind con font-sans.
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nacer Digital — Buscador de usuarios de GitHub",
  description:
    "Buscador de perfiles públicos de GitHub. Frontend que consume la API propia del backend NestJS.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={geistSans.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
