import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "NerdBlock Management",
  description: "Admin panel for managing orders, customers, and inventory.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <aside className="sidebar">
            
            {/* Logo Section */}
              <div className="logo-container">
              <Image src="/nerdblock-logo.jpg" alt="NerdBlock Logo" width={660} height={337} priority />
            </div>

            <nav>

              <ul>
                <li><Link href="/">Dashboard</Link></li>
                <li><Link href="/orders">Orders</Link></li>
                <li><Link href="/inventory">Inventory</Link></li>
                <li><Link href="/customers">Customers</Link></li>
                <li><Link href="/subscriptions">Subscriptions</Link></li>
              </ul>
            </nav>
          </aside>
          <main className="content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
