import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas, faLock, faKey, faCircleXmark, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { far, faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Add the icons to the library
library.add(fas, faKey, faLock, far, faBagShopping, faUser, faEnvelope, faCircleXmark, fab);

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
              <li><Link href="/"><FontAwesomeIcon icon="fa-solid fa-chart-line" className="dash-icon"/> Dashboard</Link></li>
                <li><Link href="/pages/orders"><FontAwesomeIcon icon="fa-solid fa-store" className="dash-icon"/> Orders</Link></li>
                <li><Link href="/pages/inventory"><FontAwesomeIcon icon="fa-solid fa-boxes-stacked" className="dash-icon"/> Inventory</Link></li>
                <li><Link href="/pages/customers"><FontAwesomeIcon icon="fa-solid fa-user" className="dash-icon"/> Customers</Link></li>
                <li><Link href="/pages/subscriptions"><FontAwesomeIcon icon="fa-solid fa-calendar-day" className="dash-icon"/> Subscriptions</Link></li>
                <li><Link href="/pages/reporting"><FontAwesomeIcon icon="fa-solid fa-clipboard-list" className="dash-icon"/> Reports</Link></li>
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
