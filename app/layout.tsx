import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://castellininicolo.github.io/Nico";
const socialImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nicolò Castellini — Idee, tecnologia e prodotti digitali",
  description:
    "Il sito personale di Nicolò Castellini: tecnologia, prodotti digitali, AI e automazione.",
  icons: {
    icon: `${siteUrl}/favicon.svg`,
    shortcut: `${siteUrl}/favicon.svg`,
  },
  openGraph: {
    title: "Nicolò Castellini — Idee complesse, esperienze semplici",
    description:
      "Un racconto in evoluzione tra tecnologia, creatività e cose costruite bene.",
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    images: [{ url: socialImage, width: 1734, height: 907 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolò Castellini — Idee complesse, esperienze semplici",
    description:
      "Un racconto in evoluzione tra tecnologia, creatività e cose costruite bene.",
    images: [socialImage],
  },
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
