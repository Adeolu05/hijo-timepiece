import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { JsonLd } from "../components/JsonLd";
import { JournalPostBody } from "../components/JournalPostBody";
import { breadcrumbJsonLd, blogPostingJsonLd } from "../lib/structuredData";
import { sanityClient, queries, isDemoSanityClient } from "../lib/sanity";
import type { JournalPost, SanityJournalDetail } from "../lib/journalTypes";
import { mapSanityJournalDetail } from "../lib/mapJournalPost";
import { applySeo } from "../lib/seo";
import { SITE_PUBLIC_BRAND } from "../constants/site";

function formatJournalDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });
}

export function JournalPostPage() {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const slug = slugParam ? decodeURIComponent(slugParam) : "";
  const [post, setPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!slug) {
      setNotFound(true);
      setPost(null);
      setLoading(false);
      return;
    }
    if (isDemoSanityClient()) {
      setNotFound(true);
      setPost(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    try {
      const raw = await sanityClient.fetch<SanityJournalDetail | null>(queries.getJournalPostBySlug, { slug });
      const mapped = mapSanityJournalDetail(raw);
      if (!mapped) {
        setPost(null);
        setNotFound(true);
      } else {
        setPost(mapped);
        setNotFound(false);
      }
    } catch (e) {
      console.warn("Journal post fetch failed:", e);
      setPost(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!post) return;
    applySeo({
      title: `${post.title} | Journal | ${SITE_PUBLIC_BRAND}`,
      description: post.excerpt.slice(0, 160),
      path: `/journal/${post.slug}`,
      image: post.coverImage,
    });
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
        <div className="w-11 h-11 border-4 border-outline-variant border-t-primary rounded-full animate-spin mb-6" />
        <p className="wide-label text-on-surface-variant/60 font-bold">Loading story…</p>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-6 font-light">article</span>
        <h1 className="font-headline text-4xl text-primary mb-4">Story not found</h1>
        <p className="text-on-surface-variant mb-10 font-light text-center max-w-md">
          This journal entry does not exist or is not published yet.
        </p>
        <Link to="/journal" className="text-secondary hover:underline wide-label !text-[10px] font-bold">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
          { name: post.title, path: `/journal/${post.slug}` },
        ])}
      />
      <JsonLd
        data={blogPostingJsonLd({
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          publishedAt: post.publishedAt,
          image: post.coverImage,
        })}
      />
      <article className="min-h-screen bg-background pt-10 pb-24 md:pt-14 md:pb-32">
        <div className="mx-auto max-w-[880px] px-4 sm:px-8 mb-12 md:mb-16">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 wide-label !text-[9px] text-secondary font-bold hover:text-primary mb-10 transition-colors"
          >
            <span aria-hidden>←</span> Journal
          </Link>
          <time dateTime={post.publishedAt} className="wide-label !text-[9px] text-on-surface-variant/50 font-bold block mb-5">
            {formatJournalDate(post.publishedAt)}
          </time>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] text-primary tight-headline leading-[1.05] mb-8">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="text-on-surface-variant text-lg md:text-xl font-light leading-relaxed font-serif opacity-88 border-l-2 border-secondary/30 pl-6">
              {post.excerpt}
            </p>
          ) : null}
        </div>
        {post.coverImage ? (
          <div className="mx-auto max-w-6xl px-3 sm:px-8 mb-16 md:mb-24">
            <div className="overflow-hidden luxury-shadow ring-1 ring-outline-variant/12 bg-surface-container-low">
              <img
                src={post.coverImage}
                alt=""
                className="w-full h-auto max-h-[min(88vh,960px)] object-cover object-center"
              />
            </div>
          </div>
        ) : null}
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <JournalPostBody blocks={post.body} titleFallback={post.title} />
        </div>
      </article>
    </>
  );
}
