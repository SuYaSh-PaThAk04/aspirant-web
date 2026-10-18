import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-4">
      <p className="text-muted text-sm">Aspirant Adda</p>
      <h1 className="text-2xl">This page is not available.</h1>
      <Link href="/feed" className="text-accent font-medium">
        Browse discussions
      </Link>
    </main>
  );
}
