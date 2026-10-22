"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, Menu, X, Home } from "lucide-react";

const links = [
  { href: "/", label: "Rechercher" },
  { href: "/verification", label: "Notre vérification" },
  { href: "/publier", label: "Publier une annonce" },
  { href: "/admin", label: "Modération" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-pine text-white transition group-hover:bg-pine-deep">
            <Home size={17} strokeWidth={2.4} />
            <ShieldCheck
              size={13}
              className="absolute -right-1.5 -bottom-1.5 rounded-full bg-saffron p-[1px] text-pine-deep"
              strokeWidth={2.6}
            />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Logement<span className="text-pine">Sûr</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-pine text-white"
                    : "text-ink/70 hover:bg-moss hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="rounded-lg border border-line p-2 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-moss"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}