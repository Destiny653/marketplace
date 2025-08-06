import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartAccessProvider from "@/components/layout/CartAccessProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "sonner"; // Import the Toaster component from sonner
import { ThemeProvider } from "@/components/ui/theme-provider";
import { PaymentProvider } from "@/contexts/PaymentContext";

export const metadata: Metadata = {
  title: "Marketplace - Your Online Shopping Destination",
  description: "Find the best products at great prices in our online marketplace",
  icons: {
    icon: "./logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <AuthProvider>
            <PaymentProvider>
              <CartAccessProvider>
                <main className="min-h-screen">{children}</main>
                {/* Add the Sonner Toaster component here */}
                <Toaster position="top-right" richColors closeButton />
              </CartAccessProvider>
            </PaymentProvider>
          </AuthProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}