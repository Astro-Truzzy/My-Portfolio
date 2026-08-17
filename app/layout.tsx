import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { site } from "@/lib/content";
import { Preloader } from "@/components/preloader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
  display: "swap",
  preload: false,
});

const description =
  "Full-stack engineer and founder. Ridely (dispatch logistics) and Ownbase (developer access). Based in Port Harcourt, open to full-stack roles.";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} — ${site.shortRole}`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "Trust Williams",
    "Full-Stack Developer",
    "Ridely",
    "Ownbase",
    "Port Harcourt",
    "Next.js",
    "React Native",
  ],
  authors: [{ name: site.name, url: site.siteUrl }],
  creator: site.name,
  openGraph: {
    title: `${site.name} — ${site.shortRole}`,
    description,
    type: "website",
    locale: "en_NG",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.shortRole}`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",t==="light"||t==="dark"?t:"dark");}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Port Harcourt",
    addressRegion: "Rivers State",
    addressCountry: "NG",
  },
  alumniOf: "University of Benin",
  sameAs: ["https://github.com/Astro-Truzzy"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-svh bg-canvas font-sans text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
