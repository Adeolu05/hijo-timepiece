export type VideoEmbedKind = "youtube" | "vimeo" | "mp4" | "iframe";

export interface ParsedVideo {
  kind: VideoEmbedKind;
  /** YouTube or Vimeo id */
  id?: string;
  /** Direct video or fallback iframe src */
  src?: string;
}

export function parseVideoUrl(url: string): ParsedVideo {
  const u = url.trim();
  if (!u) return { kind: "iframe", src: u };
  if (/\.mp4(\?|$)/i.test(u)) return { kind: "mp4", src: u };

  const yt = u.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{10,})/);
  if (yt?.[1]) return { kind: "youtube", id: yt[1] };

  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm?.[1]) return { kind: "vimeo", id: vm[1] };

  return { kind: "iframe", src: u };
}
