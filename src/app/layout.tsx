import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@/components/google-analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "friday.tech",
  description: "배움과 도전의 흔적을 남기는 개발자들의 공간",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Friday.Tech",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#252827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Google Search Console 인증 메타 태그를 여기에 추가하세요 */}
        {/* <meta name="google-site-verification" content="여기에_구글에서_제공한_코드_입력" /> */}
        <meta
          name="google-site-verification"
          content="C13oYjpbEJuwGpLLDPTQjnhGSAA5iXr-2xprGA9Spjo"
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-[#252827] transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <main className="max-w-[1392px] md:max-w-[940px] sm:max-w-[620px] lg:max-w-[1392px] m-auto min-h-screen mt-10">
            {children}
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
