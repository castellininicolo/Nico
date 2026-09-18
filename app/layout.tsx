import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://castellininicolo.github.io/Nico";
const socialImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nicolò Castellini — Idee, tecnologia e prodotti digitali",
  description:
    "Profilo professionale di Nicolò Castellini: progettazione, prodotti digitali, software, AI e automazione.",
  icons: {
    icon: {
      url: `${siteUrl}/favicon.svg`,
      type: "image/svg+xml",
      sizes: "any",
    },
    shortcut: `${siteUrl}/favicon.svg`,
    apple: {
      url: `${siteUrl}/apple-touch-icon.png`,
      type: "image/png",
      sizes: "180x180",
    },
  },
  openGraph: {
    title: "Nicolò Castellini — Idee complesse, esperienze semplici",
    description:
      "Progettazione, tecnologia e prodotti digitali costruiti con metodo.",
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    images: [
      {
        url: socialImage,
        width: 1734,
        height: 907,
        alt: "Nicolò Castellini — Idee complesse, esperienze semplici",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolò Castellini — Idee complesse, esperienze semplici",
    description:
      "Progettazione, tecnologia e prodotti digitali costruiti con metodo.",
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
