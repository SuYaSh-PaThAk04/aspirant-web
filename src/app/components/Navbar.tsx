"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  /** Use solid glass nav (for pages without a dark hero). */
  variant?: "hero" | "page";
}

export default function Navbar({ variant = "hero" }: NavbarProps) {
  const pathname = usePathname();
  const discussionsOpen = pathname === "/feed" || pathname.startsWith("/c/");
  const isPage = variant === "page";
  const [overHero, setOverHero] = useState(!isPage);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isPage) {
      setOverHero(false);
    }

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!isPage) {
        const heroThreshold = Math.max(window.innerHeight - 120, 120);
        setOverHero(currentScrollY < heroThreshold);
      }

      // Keep navbar visible while the mobile menu is open
      if (menuOpen) {
        setVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= 16) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isPage, menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const solid = isPage || !overHero || menuOpen;

  const linkClass = solid
    ? "border-brand/40 text-brand hover:border-brand hover:text-brand"
    : "border-white/40 text-white/90 hover:border-white hover:text-white";

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: solid ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: solid ? "blur(16px) saturate(160%)" : "none",
        WebkitBackdropFilter: solid ? "blur(16px) saturate(160%)" : "none",
        borderBottom: solid ? "1px solid rgba(79,70,229,0.12)" : "none",
        boxShadow: solid ? "0 10px 30px rgba(79,70,229,0.08)" : "none",
        transform: visible || menuOpen ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
            <img
              src="/Logo.png"
              alt="Aspirant Adda Logo"
              className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
              style={{ width: 40, height: 40, objectFit: "contain" }}
            />
            <span
              className={`font-display text-xl font-bold tracking-tight transition-colors duration-300 ${
                solid ? "text-brand" : "text-white"
              }`}
            >
              Aspirant Adda
            </span>
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/feed"
              aria-current={discussionsOpen ? "page" : undefined}
              className={
                discussionsOpen
                  ? "rounded-full border border-brand bg-brand px-4 py-1.5 font-body text-sm font-semibold text-white"
                  : `rounded-full border px-4 py-1.5 font-body text-sm font-medium transition-all duration-200 ${linkClass}`
              }
            >
              Discussions
            </Link>
            <Link
              href="/about"
              className={`rounded-full border px-4 py-1.5 font-body text-sm font-medium transition-all duration-200 ${linkClass}`}
            >
              About Us
            </Link>
          </div>
        </div>

        <button
          type="button"
          className={`relative z-[60] flex h-10 w-10 items-center justify-center md:hidden ${
            solid ? "text-brand" : "text-white"
          }`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-brand/10 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4">
            <Link
              href="/feed"
              aria-current={discussionsOpen ? "page" : undefined}
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 font-body text-base font-medium transition-colors hover:bg-brand/5 ${
                discussionsOpen ? "bg-brand text-white hover:bg-brand" : "text-brand"
              }`}
            >
              Discussions
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-body text-base font-medium text-brand transition-colors hover:bg-brand/5"
            >
              About Us
            </Link>
            <a
              href="/#become-mentor"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 font-body text-base font-medium text-brand transition-colors hover:bg-brand/5"
            >
              Become a Mentor
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=in.aspirantadda.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mt-1 rounded-full bg-brand px-4 py-3 text-center font-body text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Join Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
