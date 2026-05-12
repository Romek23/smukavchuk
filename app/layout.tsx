import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PageLoader from "@/components/layout/page-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smukavchuk Epoxid Art",
  description: "Premium epoxy art gallery and handmade artistic creations.",
  keywords: ["epoxy art", "handmade art", "gallery", "smukavchuk"],
  authors: [{ name: "Smukavchuk" }],
  openGraph: {
    title: "Smukavchuk Epoxid Art",
    description: "Premium epoxy art gallery and handmade artistic creations.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
  },
};

const themeScript = `
(function() {
  try {
    var storedTheme = window.localStorage.getItem("smukavchuk-theme");
    var theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch (error) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <PageLoader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
