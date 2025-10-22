import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "friday.tech",
  description: "배움과 도전의 흔적을 남기는 개발자들의 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <main className="max-w-[1392px] md:max-w-[940px] sm:max-w-[620px] lg:max-w-[1392px] m-auto min-h-screen mt-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
