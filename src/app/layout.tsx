import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SplitBills - Easy Expense Splitting for Groups",
  description: "Effortlessly split bills and track expenses with friends, roommates, and travel groups. Calculate who owes whom with our smart expense splitting calculator.",
  keywords: [
    "split bills",
    "expense sharing",
    "bill splitting calculator",
    "group expenses",
    "travel expense tracker",
    "roommate expenses",
    "shared costs",
    "expense management",
    "bill calculator",
    "group finance",
    "expense splitter",
    "cost sharing app"
  ].join(", "),
  authors: [{ name: "SplitBills Team" }],
  creator: "SplitBills",
  publisher: "SplitBills",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://splitbills.app",
    title: "SplitBills - Easy Expense Splitting for Groups",
    description: "Effortlessly split bills and track expenses with friends, roommates, and travel groups. Calculate who owes whom with our smart expense splitting calculator.",
    siteName: "SplitBills",
  },
  twitter: {
    card: "summary_large_image",
    title: "SplitBills - Easy Expense Splitting for Groups",
    description: "Effortlessly split bills and track expenses with friends, roommates, and travel groups.",
    creator: "@splitbills",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  if (theme === 'system') {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    }
                  } else if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
