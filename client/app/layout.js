import "./globals.css";
import ScrollRevealObserver from "@/components/ScrollRevealObserver";
import CommonFooter from "@/components/CommonFooter";
import TopBar from "@/components/TopBar";
import AuthProvider from "@/components/auth/AuthProvider";
import CartProvider from "@/components/cart/CartProvider";

export const metadata = {
  title: "IndevDigital",
  description: "A visually rich black hole animation built with Next.js and Canvas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <ScrollRevealObserver />
            <TopBar />
            <div className="app-page-shell">{children}</div>
            <CommonFooter />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
