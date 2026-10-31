import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@/components/Analytics";
import { AuthProvider } from "@/components/AuthProvider";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Aspirant Adda",
    template: "%s · Aspirant Adda",
  },
  description: "Exam discussions from aspirants on Aspirant Adda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plex.variable} suppressHydrationWarning>
      <body className="min-h-screen w-full overflow-x-hidden antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('aa-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}",
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KSMMSNBCVZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KSMMSNBCVZ');
          `}
        </Script>
        <AuthProvider>
          <Analytics />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
