import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { JsonLd } from "../components/JsonLd";
import { breadcrumbJsonLd } from "../lib/structuredData";
import { sanityClient, queries, isDemoSanityClient } from "../lib/sanity";
import type { JournalPost, SanityJournalListItem } from "../lib/journalTypes";
import { mapSanityJournalListItem } from "../lib/mapJournalPost";
import { applySeo } from "../lib/seo";
import { JOURNAL_PAGE_META_DESCRIPTION, JOURNAL_PAGE_META_TITLE, SITE_PUBLIC_BRAND } from "../constants/site";
import { formatJournalPublishedDisplay, journalPublishedAtForJsonLd } from "../lib/journalPublishedAt";

export function Journal() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isDemoSanityClient()) {
      setPosts([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const raw = await sanityClient.fetch<SanityJournalListItem[]>(queries.getAllJournalPosts);
      const mapped = (raw ?? [])
        .map((row) => mapSanityJournalListItem(row))
        .filter((p): p is JournalPost => p != null);
      setPosts(mapped);
    } catch (e) {
      console.warn("Journal fetch failed:", e);
      setError("Could not load journal posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    applySeo({
      title: JOURNAL_PAGE_META_TITLE,
      description: JOURNAL_PAGE_META_DESCRIPTION,
      path: "/journal",
    });
  }, []);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
        ])}
      />
      <div className="min-h-screen bg-background pt-10 pb-24 md:pt-14 md:pb-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <header className="mb-14 md:mb-20 border-b border-outline-variant/15 pb-10">
            <span className="wide-label text-secondary mb-4 block font-bold tracking-[0.35em]">FROM THE ROAD</span>
            <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl text-primary tight-headline mb-6">
              Journal
              <span className="italic font-serif opacity-55 text-secondary block sm:inline sm:ml-3">& events</span>
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-base md:text-lg font-light leading-relaxed font-serif opacity-80">
              Fairs, private viewings, and moments from the life of {SITE_PUBLIC_BRAND}. Stories, photography, and film,
              curated here.
            </p>
          </header>

          {error && (
            <p className="text-error text-sm font-light mb-10 border border-error/20 bg-error/5 px-5 py-4" role="status">
              {error}
            </p>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center gap-5 py-24">
              <div className="w-11 h-11 border-4 border-outline-variant border-t-primary rounded-full animate-spin" />
              <p className="wide-label text-on-surface-variant/60 font-bold">Loading stories…</p>
            </div>
          )}

          {!loading && posts.length === 0 && !error && (
            <div className="text-center py-24 border border-outline-variant/15 bg-surface-container-low/30 px-6">
              <p className="text-on-surface-variant font-light mb-8 max-w-md mx-auto">
                Journal entries will appear here once they are published in Sanity. Editors: create a &ldquo;Journal
                post&rdquo; document and publish it.
              </p>
              <Link
                to="/shop"
                className="wide-label !text-[10px] text-secondary font-bold hover:text-primary transition-colors border-b border-secondary/40 pb-1"
              >
                Explore the collection
              </Link>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <ul className="grid grid-cols-1 gap-14 md:gap-20">
              {posts.map((post) => (
                <li key={post.slug}>
                  <article className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                    <Link
                      to={`/journal/${encodeURIComponent(post.slug)}`}
                      className="md:col-span-5 block overflow-hidden bg-surface-container-low aspect-[4/3] md:aspect-[5/6] luxury-shadow ring-1 ring-outline-variant/10 transition-transform duration-700 group-hover:ring-secondary/25"
                    >
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt=""
                          className="w-full h-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] grayscale-[0.15] group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center wide-label !text-[10px] text-on-surface-variant/40 font-bold">
                          No cover
                        </div>
                      )}
                    </Link>
                    <div className="md:col-span-7 flex flex-col pt-1 md:pt-3">
                      <time
                        dateTime={journalPublishedAtForJsonLd(post.publishedAt)}
                        className="wide-label !text-[9px] text-on-surface-variant/50 font-bold mb-4"
                      >
                        {formatJournalPublishedDisplay(post.publishedAt)}
                      </time>
                      <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl text-primary tight-headline mb-5 group-hover:text-secondary transition-colors">
                        <Link to={`/journal/${encodeURIComponent(post.slug)}`}>{post.title}</Link>
                      </h2>
                      <p className="text-on-surface-variant font-light leading-relaxed text-base md:text-lg font-serif opacity-85 mb-8 line-clamp-4 md:line-clamp-5">
                        {post.excerpt}
                      </p>
                      <Link
                        to={`/journal/${encodeURIComponent(post.slug)}`}
                        className="inline-flex items-center gap-2 wide-label !text-[9px] text-secondary font-bold hover:text-primary transition-colors self-start border-b border-secondary/35 pb-1"
                      >
                        Read story
                        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
