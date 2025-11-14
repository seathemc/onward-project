"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navbar Component - Responsive Navigation
 *
 * Desktop: Fixed left sidebar (256px wide)
 * Mobile: Fixed bottom navigation bar
 *
 * Features:
 * - Logo/branding at top (desktop only)
 * - Navigation links with active state highlighting
 * - Footer text at bottom (desktop only)
 * - Responsive design that adapts to screen size
 */
export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/current", label: "Current", icon: "📊" },
    { href: "/dashboard", label: "Forecast", icon: "🔮" },
  ];

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 border-r border-border bg-background z-50">
        <div className="flex flex-col h-full">

          {/* Logo Section */}
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-normal">🇧🇸 Onward</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-normal transition-all duration-150 ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-tertiary-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Planning the Bahamas' future with real data
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background z-50 safe-area-pb">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-normal transition-all duration-150 min-w-[70px] ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-tertiary-foreground"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
