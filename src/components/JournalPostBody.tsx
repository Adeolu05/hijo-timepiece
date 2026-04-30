import type { ReactNode } from "react";
import type { JournalBlock } from "../lib/journalTypes";
import { parseVideoUrl } from "../lib/videoEmbed";
import { SITE_PUBLIC_BRAND } from "../constants/site";

interface JournalPostBodyProps {
  blocks: JournalBlock[];
  titleFallback: string;
}

export function JournalPostBody({ blocks, titleFallback }: JournalPostBodyProps) {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {blocks.map((block, i) => {
        const k = block.key ?? `block-${i}`;
        if (block.kind === "text") {
          return (
            <div
              key={k}
              className="max-w-3xl mx-auto px-1 text-on-surface-variant text-lg md:text-xl font-light leading-relaxed font-serif opacity-92"
            >
              {block.text.split(/\n\n+/).map((para, j) => (
                <p key={j} className={j > 0 ? "mt-6" : ""}>
                  {para}
                </p>
              ))}
            </div>
          );
        }
        if (block.kind === "figure") {
          return (
            <figure key={k} className="mx-auto w-full max-w-4xl">
              <div className="overflow-hidden bg-surface-container-low luxury-shadow ring-1 ring-outline-variant/15">
                <img
                  src={block.imageUrl}
                  alt={block.caption ?? `${titleFallback} · editorial image, ${SITE_PUBLIC_BRAND}`}
                  className="w-full h-auto object-cover max-h-[min(85vh,920px)]"
                />
              </div>
              {block.caption ? (
                <figcaption className="mt-5 text-center wide-label !text-[9px] text-on-surface-variant/70 font-bold tracking-[0.2em] px-4">
                  {block.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        }
        const parsed = parseVideoUrl(block.url);
        const caption = block.caption;
        let media: ReactNode;
        if (parsed.kind === "youtube" && parsed.id) {
          media = (
            <div className="relative w-full aspect-video bg-black">
              <iframe
                title={caption ?? "Embedded YouTube video"}
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(parsed.id)}?rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          );
        } else if (parsed.kind === "vimeo" && parsed.id) {
          media = (
            <div className="relative w-full aspect-video bg-black">
              <iframe
                title={caption ?? "Embedded Vimeo video"}
                src={`https://player.vimeo.com/video/${encodeURIComponent(parsed.id)}`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        } else if (parsed.kind === "mp4" && parsed.src) {
          media = (
            <video
              className="w-full h-auto max-h-[min(85vh,920px)] bg-black mx-auto block"
              controls
              playsInline
              preload="metadata"
              src={parsed.src}
            />
          );
        } else {
          media = (
            <div className="relative w-full aspect-video bg-surface-container-low">
              <iframe title={caption ?? "Embedded video"} src={parsed.src} className="absolute inset-0 w-full h-full" />
            </div>
          );
        }
        return (
          <figure key={k} className="mx-auto w-full max-w-4xl">
            <div className="overflow-hidden luxury-shadow ring-1 ring-outline-variant/15">{media}</div>
            {caption ? (
              <figcaption className="mt-5 text-center wide-label !text-[9px] text-on-surface-variant/70 font-bold tracking-[0.2em] px-4">
                {caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
