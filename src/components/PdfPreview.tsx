"use client";

import { useEffect, useRef, useState } from "react";

function attachmentName(url: string) {
  const file = decodeURIComponent(url.split("?")[0]?.split("/").pop() ?? "");
  const named = file.includes("_aa_") ? (file.split("_aa_").pop() ?? file) : file;
  const label = named
    .replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}_/i, "")
    .replaceAll("_", " ")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return label || "Attachment";
}

export function isPdf(item: { url: string }) {
  return /\.pdf($|\?)/i.test(item.url);
}

export function PdfPreview({ url }: { url: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const name = attachmentName(url);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;
    let cancelled = false;
    const jobs: { cancel: () => void }[] = [];
    let destroyDoc: (() => Promise<void>) | null = null;

    (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const loadingTask = pdfjs.getDocument({ url });
      destroyDoc = () => loadingTask.destroy();
      const pdf = await loadingTask.promise;
      if (cancelled) return;
      const page = await pdf.getPage(1);
      if (cancelled) return;
      const width = Math.max(frame.clientWidth, 1);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: (width / base.width) * ratio });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const renderTask = page.render({ canvas, viewport });
      jobs.push(renderTask);
      await renderTask.promise;
      if (!cancelled) setStatus("ready");
    })().catch(() => {
      if (!cancelled) setStatus("error");
    });

    return () => {
      cancelled = true;
      for (const job of jobs) job.cancel();
      void destroyDoc?.();
    };
  }, [url]);

  return (
    <figure className="border-line overflow-hidden rounded-xl border">
      <div ref={frameRef} className="relative bg-white">
        {status === "ready" ? null : (
          <div className="text-muted flex aspect-[3/4] items-center justify-center px-4 text-center text-sm">
            {status === "error" ? "Preview unavailable" : "Loading preview"}
          </div>
        )}
        <canvas ref={canvasRef} aria-label={name} className={status === "ready" ? "block h-auto w-full" : "hidden"} />
      </div>
      <figcaption className="bg-sunken flex items-center gap-2 px-3 py-2">
        <span className="bg-danger text-on-primary rounded px-1.5 py-0.5 text-[11px] font-bold">PDF</span>
        <span className="min-w-0 flex-1 truncate text-xs">{name}</span>
        <a href={url} target="_blank" rel="noreferrer" className="text-accent shrink-0 text-xs font-medium">
          Open
        </a>
      </figcaption>
    </figure>
  );
}
