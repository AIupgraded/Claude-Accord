import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = "https://getaccord.online";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Claude Accord — Working together. Building trust.",
    template: "%s | Claude Accord",
  },
  description: "A human-AI collaboration platform. Courses, tools, and a protocol that teaches you and Claude how to work together. Built on trust, not commands.",
  keywords: ["Claude", "AI collaboration", "human-AI", "MCP", "protocol", "Claude Accord", "AI courses", "AI trust"],
  authors: [{ name: "Claudiu Cornea" }],
  creator: "Claude Accord",
  publisher: "Claude Accord",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Claude Accord",
    title: "Claude Accord — Working together. Building trust.",
    description: "A human-AI collaboration platform. Courses, tools, and a protocol that teaches you and Claude how to work together.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Accord — Working together. Building trust.",
    description: "A human-AI collaboration platform. Courses, tools, and a protocol that teaches you and Claude how to work together.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Claude Accord",
              url: siteUrl,
              description: "A human-AI collaboration platform. Courses, tools, and a protocol that teaches you and Claude how to work together.",
              founder: {
                "@type": "Person",
                name: "Claudiu Cornea",
              },
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Claude Accord",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/blog?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
