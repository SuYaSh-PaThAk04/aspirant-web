export function ShimmerBar({ className }: { className: string }) {
  return <span className={`shimmer block ${className}`} />;
}

export function FeedCardSkeleton() {
  return (
    <div className="border-line rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <ShimmerBar className="size-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <ShimmerBar className="h-3.5 w-32 rounded-full" />
          <ShimmerBar className="h-3 w-48 rounded-full" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <ShimmerBar className="h-3 w-full rounded-full" />
        <ShimmerBar className="h-3 w-11/12 rounded-full" />
        <ShimmerBar className="h-3 w-2/3 rounded-full" />
      </div>
      <div className="mt-4 flex gap-4">
        <ShimmerBar className="h-3 w-8 rounded-full" />
        <ShimmerBar className="h-3 w-8 rounded-full" />
        <ShimmerBar className="h-3 w-8 rounded-full" />
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <header className="border-line bg-canvas sticky top-0 z-10 border-b">
      <div className="grid w-full grid-cols-[1fr_minmax(0,32rem)_1fr] items-center gap-3 px-3 py-3">
        <ShimmerBar className="h-5 w-32 justify-self-start rounded-full" />
        <ShimmerBar className="h-9 rounded-full" />
        <ShimmerBar className="h-9 w-28 justify-self-end rounded-full" />
      </div>
    </header>
  );
}

function SideSkeleton() {
  return (
    <>
      <aside className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-16">
        <ShimmerBar className="h-56 rounded-2xl lg:h-[calc((100vh-6.25rem)/2)]" />
        <ShimmerBar className="h-56 rounded-2xl lg:h-[calc((100vh-6.25rem)/2)]" />
      </aside>
    </>
  );
}

function RailSkeleton() {
  return (
    <aside className="lg:sticky lg:top-16">
      <ShimmerBar className="h-4 w-28 rounded-full" />
      <div className="border-line mt-2 space-y-3 rounded-2xl border bg-card p-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <ShimmerBar className="size-11 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <ShimmerBar className="h-3 w-24 rounded-full" />
              <ShimmerBar className="h-2.5 w-16 rounded-full" />
            </div>
            <ShimmerBar className="h-7 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </aside>
  );
}

export function AppLoading({ variant }: { variant: "feed" | "post" }) {
  return (
    <div className="min-h-screen" aria-busy="true">
      <span className="sr-only">Loading</span>
      <HeaderSkeleton />
      <div className="grid w-full gap-3 px-3 py-3 lg:grid-cols-[360px_minmax(0,1fr)_260px]">
        <SideSkeleton />
        <div className="min-w-0">
          {variant === "feed" ? (
            <>
              <ShimmerBar className="h-7 w-40 rounded-full" />
              <ShimmerBar className="mt-2 h-3 w-64 rounded-full" />
              <div className="mt-3 space-y-3">
                {Array.from({ length: 4 }, (_, index) => (
                  <FeedCardSkeleton key={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="border-line space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
              <div className="flex gap-3">
                <ShimmerBar className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2 pt-1">
                  <ShimmerBar className="h-3 w-40 rounded-full" />
                  <ShimmerBar className="h-3.5 w-32 rounded-full" />
                </div>
              </div>
              <ShimmerBar className="h-6 w-4/5 rounded-full" />
              <ShimmerBar className="h-3 w-full rounded-full" />
              <ShimmerBar className="h-3 w-11/12 rounded-full" />
              <ShimmerBar className="h-3 w-2/3 rounded-full" />
              <ShimmerBar className="h-40 w-full rounded-xl" />
              <div className="space-y-3 pt-2">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="flex gap-3">
                    <ShimmerBar className="size-8 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <ShimmerBar className="h-3 w-24 rounded-full" />
                      <ShimmerBar className="h-3 w-full rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <RailSkeleton />
      </div>
    </div>
  );
}
