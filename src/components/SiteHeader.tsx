"use client";

import { Moon, Search, Sun, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ShimmerBar } from "@/components/Shimmer";

function SearchField({ query }: { query: string }) {
  const router = useRouter();
  return (
    <form
      action="/"
      className="relative"
      onSubmit={(event) => {
        const q = String(new FormData(event.currentTarget).get("q") ?? "").trim();
        if (q) return;
        event.preventDefault();
        router.push("/");
      }}
    >
      <Search size={16} className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2" />
      <input
        name="q"
        defaultValue={query}
        placeholder="Search discussions"
        aria-label="Search discussions"
        className="border-line bg-sunken placeholder:text-muted focus:border-accent w-full rounded-full border py-2 pr-4 pl-9 text-sm outline-none"
      />
    </form>
  );
}

function HeaderSearch() {
  const query = useSearchParams().get("q") ?? "";
  return <SearchField key={query} query={query} />;
}

export function SiteHeader() {
  const { user, ready, login, logout } = useAuth();
  const label = user?.name || (user?.username ? `@${user.username}` : "Aspirant");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function chooseTheme(next: "light" | "dark") {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("aa-theme", next);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onPointer(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!user) setMenuOpen(false);
  }, [user]);

  return (
    <header className="border-line bg-canvas/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="grid w-full grid-cols-[1fr_minmax(0,32rem)_1fr] items-center gap-3 px-3 py-3">
        <Link href="/" className="text-heading justify-self-start text-base font-bold whitespace-nowrap">
          Aspirant Adda
        </Link>
        <div className="min-w-0">
          <Suspense fallback={<SearchField query="" />}>
            <HeaderSearch />
          </Suspense>
        </div>
        <div className="flex items-center justify-self-end">
          {!ready ? (
            <ShimmerBar className="h-9 w-28 rounded-full" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="border-line bg-card flex shrink-0 items-center gap-2 rounded-full border py-1 pr-3 pl-1 shadow-sm"
              >
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="" className="size-8 rounded-full object-cover" />
                ) : (
                  <span className="bg-accent-soft text-accent flex size-8 items-center justify-center rounded-full">
                    <User size={16} />
                  </span>
                )}
                <span className="text-heading max-w-40 truncate text-sm font-bold">{label}</span>
              </button>
              {menuOpen ? (
                <div
                  role="menu"
                  className="border-line absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border bg-card py-1 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <span className="text-heading text-sm font-medium">Display mode</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={theme === "light"}
                      aria-label="Display mode"
                      onClick={() => chooseTheme(theme === "light" ? "dark" : "light")}
                      className="border-line bg-line relative h-7 w-[3.25rem] shrink-0 rounded-full border"
                    >
                      <span
                        className={`bg-card text-heading border-line absolute top-0.5 flex size-6 items-center justify-center rounded-full border shadow-sm ${
                          theme === "light" ? "left-[1.55rem]" : "left-0.5"
                        }`}
                      >
                        {theme === "light" ? <Sun size={14} /> : <Moon size={14} />}
                      </span>
                    </button>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      void logout();
                    }}
                    className="hover:bg-sunken text-danger w-full px-4 py-2.5 text-left text-sm font-medium"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              className="bg-accent text-on-primary shrink-0 rounded-full px-4 py-1.5 text-sm font-bold whitespace-nowrap"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
