"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface SavedFeed {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

interface RssItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  summary: string;
}

interface FeedPreview {
  url: string;
  title: string;
  description: string;
  link: string;
}

const SAMPLE_FEEDS = [
  { name: "OpenAI News", url: "https://openai.com/news/rss.xml" },
  { name: "Google DeepMind", url: "https://deepmind.google/blog/feed/basic/" },
];

export default function RssAggregatorPage() {
  const [feeds, setFeeds] = useState<SavedFeed[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(true);

  // Items stream state
  const [items, setItems] = useState<RssItem[]>([]);
  const [feedMeta, setFeedMeta] = useState<{ title: string; description: string; link: string } | null>(null);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState("");

  // Add Feed Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewData, setPreviewData] = useState<FeedPreview | null>(null);
  const [customName, setCustomName] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete Feed state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch all saved feeds from DB
  const loadSavedFeeds = useCallback(async (autoSelectId?: string) => {
    setIsLoadingFeeds(true);
    try {
      const res = await fetch("/api/v1/rss");
      if (res.ok) {
        const data = await res.json();
        const feedList: SavedFeed[] = data.feeds || [];
        setFeeds(feedList);

        if (autoSelectId) {
          setSelectedFeedId(autoSelectId);
        } else if (feedList.length > 0 && !selectedFeedId) {
          setSelectedFeedId(feedList[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load saved feeds:", err);
    } finally {
      setIsLoadingFeeds(false);
    }
  }, [selectedFeedId]);

  useEffect(() => {
    loadSavedFeeds();
  }, [loadSavedFeeds]);

  // Fetch articles when selected feed changes
  const loadFeedItems = useCallback(async (feedId: string) => {
    setIsLoadingItems(true);
    setItemsError("");
    setItems([]);
    setFeedMeta(null);

    try {
      const res = await fetch(`/api/v1/rss/items?id=${encodeURIComponent(feedId)}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setFeedMeta({
          title: data.feedTitle || "",
          description: data.feedDescription || "",
          link: data.feedLink || "",
        });
      } else {
        const errData = await res.json();
        setItemsError(errData.error || "Failed to load feed items.");
      }
    } catch (err: any) {
      setItemsError(err.message || "An error occurred while fetching news items.");
    } finally {
      setIsLoadingItems(false);
    }
  }, []);

  useEffect(() => {
    if (selectedFeedId) {
      loadFeedItems(selectedFeedId);
    }
  }, [selectedFeedId, loadFeedItems]);

  // Handle Fetch / Preview feed metadata
  const handlePreviewFeed = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith("https://")) {
      setModalError("URL must start with https://");
      return;
    }

    setModalError("");
    setIsPreviewing(true);
    setPreviewData(null);

    try {
      const res = await fetch("/api/v1/rss/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      if (res.ok) {
        const data: FeedPreview = await res.json();
        setPreviewData(data);
        setCustomName(data.title || "My RSS Feed");
      } else {
        const err = await res.json();
        setModalError(err.error || "The provided URL is not a valid RSS or Atom XML feed.");
      }
    } catch (err: any) {
      setModalError(err.message || "Network error fetching feed preview.");
    } finally {
      setIsPreviewing(false);
    }
  };

  // Handle Save feed to DB
  const handleSaveFeed = async () => {
    if (!previewData && !inputUrl) return;

    const urlToSave = previewData?.url || inputUrl.trim();
    const nameToSave = customName.trim() || previewData?.title || urlToSave;

    setModalError("");
    setIsSaving(true);

    try {
      const res = await fetch("/api/v1/rss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameToSave, url: urlToSave }),
      });

      if (res.ok) {
        const data = await res.json();
        const newFeed: SavedFeed = data.feed;
        setIsModalOpen(false);
        resetModal();
        await loadSavedFeeds(newFeed.id);
      } else {
        const err = await res.json();
        setModalError(err.error || "Failed to save feed.");
      }
    } catch (err: any) {
      setModalError(err.message || "Error saving feed.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete feed
  const handleDeleteFeed = async (feedId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this RSS feed?")) return;

    setDeletingId(feedId);
    try {
      const res = await fetch(`/api/v1/rss?id=${encodeURIComponent(feedId)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const nextFeeds = feeds.filter((f) => f.id !== feedId);
        setFeeds(nextFeeds);
        if (selectedFeedId === feedId) {
          const newSelected = nextFeeds.length > 0 ? nextFeeds[0].id : null;
          setSelectedFeedId(newSelected);
        }
      }
    } catch (err) {
      console.error("Failed to delete feed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const resetModal = () => {
    setInputUrl("");
    setPreviewData(null);
    setCustomName("");
    setModalError("");
    setIsPreviewing(false);
    setIsSaving(false);
  };

  const formatPubDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffHours < 48) return "Yesterday";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return isoString;
    }
  };

  const extractHost = (urlStr: string) => {
    try {
      return new URL(urlStr).hostname.replace(/^www\./, "");
    } catch {
      return urlStr;
    }
  };

  const activeFeed = feeds.find((f) => f.id === selectedFeedId);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Top Header & Breadcrumb */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-fg-muted">
            <Link href="/modules" className="hover:text-fg transition-colors">
              modules
            </Link>
            <span>/</span>
            <span className="text-accent">rss_aggregator</span>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg">
            RSS Aggregator
          </h1>
        </div>

        <button
          onClick={() => {
            resetModal();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-dim active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add RSS Feed
        </button>
      </div>

      {/* 2-Column Split Layout: Left Sidebar for Sources + Right Main Area for News */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* LEFT SIDEBAR: RSS Sources List (Narrower) */}
        <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 rounded-2xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center justify-between px-2 pb-2 border-b border-border/60">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-fg-muted">
              Feeds Sources ({feeds.length})
            </span>
            <button
              onClick={() => {
                resetModal();
                setIsModalOpen(true);
              }}
              className="text-xs text-accent hover:underline font-medium"
            >
              + Add
            </button>
          </div>

          {isLoadingFeeds ? (
            <div className="space-y-2 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-full animate-pulse rounded-xl bg-surface-hover" />
              ))}
            </div>
          ) : feeds.length === 0 ? (
            <div className="py-8 text-center px-4">
              <p className="text-xs text-fg-muted">No RSS feeds saved yet.</p>
              <button
                onClick={() => {
                  resetModal();
                  setIsModalOpen(true);
                }}
                className="mt-3 inline-block text-xs font-medium text-accent hover:underline"
              >
                + Add your first feed
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
              {feeds.map((feed) => {
                const isSelected = feed.id === selectedFeedId;
                return (
                  <div
                    key={feed.id}
                    onClick={() => setSelectedFeedId(feed.id)}
                    className={`group relative flex cursor-pointer items-center justify-between rounded-xl p-3 text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-accent/15 border border-accent/40 text-fg shadow-sm"
                        : "bg-surface hover:bg-surface-hover text-fg-muted hover:text-fg border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${isSelected ? "bg-accent text-white" : "bg-bg text-fg-muted group-hover:text-accent"}`}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-semibold ${isSelected ? "text-fg" : "text-fg-muted group-hover:text-fg"}`}>
                          {feed.name}
                        </p>
                        <p className="truncate text-[11px] text-fg-muted/70 font-mono">
                          {extractHost(feed.url)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteFeed(feed.id, e)}
                      disabled={deletingId === feed.id}
                      title="Remove feed"
                      className="rounded p-1 text-fg-muted/60 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all flex-shrink-0"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* RIGHT MAIN AREA: Articles Feed (Wider Column) */}
        <main className="flex-1 min-w-0 w-full">
          {selectedFeedId && activeFeed ? (
            <div>
              {/* Selected Feed Header & Toolbar */}
              <div className="mb-6 rounded-2xl border border-border bg-surface p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-status-active animate-pulse" />
                    <h2 className="font-display text-xl font-bold text-fg">
                      {feedMeta?.title || activeFeed.name}
                    </h2>
                  </div>
                  {feedMeta?.description && (
                    <p className="mt-1 text-xs text-fg-muted line-clamp-2 max-w-xl">
                      {feedMeta.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => loadFeedItems(selectedFeedId)}
                    disabled={isLoadingItems}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg px-3.5 py-1.5 text-xs font-medium text-fg hover:border-fg-muted/40 disabled:opacity-50 transition-colors"
                  >
                    <svg className={`h-3.5 w-3.5 ${isLoadingItems ? "animate-spin text-accent" : "text-fg-muted"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isLoadingItems ? "Refreshing..." : "Refresh"}
                  </button>

                  {feedMeta?.link && (
                    <a
                      href={feedMeta.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-accent/10 border border-accent/20 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
                    >
                      Website ↗
                    </a>
                  )}
                </div>
              </div>

              {/* Loading Skeletons */}
              {isLoadingItems && (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-2xl border border-border bg-surface p-5 animate-pulse">
                      <div className="h-4 w-24 rounded bg-border mb-3" />
                      <div className="h-6 w-3/4 rounded bg-border mb-3" />
                      <div className="h-4 w-full rounded bg-border mb-2" />
                      <div className="h-4 w-2/3 rounded bg-border mb-4" />
                      <div className="h-4 w-28 rounded bg-border" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {itemsError && !isLoadingItems && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
                  <p className="text-sm font-medium text-red-400 mb-1">Error loading feed items</p>
                  <p className="text-xs text-fg-muted mb-4">{itemsError}</p>
                  <button
                    onClick={() => loadFeedItems(selectedFeedId)}
                    className="rounded-lg bg-red-500/20 px-4 py-2 text-xs font-medium text-red-300 hover:bg-red-500/30 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* News Articles Cards (Single Card Per Line) */}
              {!isLoadingItems && !itemsError && items.length > 0 && (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:border-accent/40 hover:bg-surface-hover hover:shadow-lg"
                    >
                      <div>
                        <div className="mb-2.5 flex items-center justify-between text-xs text-fg-muted">
                          <span className="font-mono text-[11px] text-accent font-semibold">{activeFeed.name}</span>
                          <span className="font-mono text-[11px] text-fg-muted/80">{formatPubDate(item.pubDate)}</span>
                        </div>

                        <h3 className="font-display text-lg font-bold text-fg leading-snug group-hover:text-accent transition-colors">
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        </h3>

                        {item.summary && (
                          <p className="mt-3 text-xs text-fg-muted leading-relaxed line-clamp-3">
                            {item.summary}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-dim hover:underline transition-colors"
                        >
                          Read full article
                          <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {!isLoadingItems && !itemsError && items.length === 0 && (
                <div className="rounded-2xl border border-border bg-surface p-12 text-center text-fg-muted">
                  No news articles found in this feed.
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-fg">No RSS Feed Selected</h3>
              <p className="mt-1 text-sm text-fg-muted max-w-md mx-auto">
                Select an RSS feed from the left sidebar or add a new RSS URL to read the latest updates.
              </p>

              <div className="mt-6">
                <button
                  onClick={() => {
                    resetModal();
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-dim transition-all"
                >
                  Add RSS Feed
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50 max-w-lg mx-auto">
                <p className="text-xs font-mono text-fg-muted mb-3">Or click a sample feed to test quickly:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SAMPLE_FEEDS.map((sample) => (
                    <button
                      key={sample.url}
                      onClick={() => {
                        resetModal();
                        setInputUrl(sample.url);
                        setIsModalOpen(true);
                      }}
                      className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-fg-muted hover:border-accent hover:text-accent transition-colors"
                    >
                      + {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Feed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-display text-xl font-bold text-fg">Add New RSS Feed</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-fg-muted hover:bg-surface-hover hover:text-fg transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {!previewData ? (
                /* Step 1: HTTPS URL Input + Fetch Button */
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-fg-muted" htmlFor="rssUrl">
                    HTTPS RSS / Atom Feed URL
                  </label>
                  <input
                    id="rssUrl"
                    type="url"
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      if (modalError) setModalError("");
                    }}
                    placeholder="https://openai.com/news/rss.xml"
                    className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  />

                  {/* Quick sample pills */}
                  <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[11px] text-fg-muted">Quick test:</span>
                    {SAMPLE_FEEDS.map((s) => (
                      <button
                        key={s.url}
                        onClick={() => {
                          setInputUrl(s.url);
                          if (modalError) setModalError("");
                        }}
                        className="rounded bg-bg px-2.5 py-1 text-[11px] text-fg-muted hover:border hover:border-accent/40 hover:text-accent transition-all"
                      >
                        + {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Step 2: Validated RSS Feed -> Edit Title & Confirm */
                <div className="space-y-4">
                  <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-active text-[10px] text-black font-bold">✓</span>
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                        Valid RSS Feed Confirmed
                      </span>
                    </div>
                    {previewData.description && (
                      <p className="text-xs text-fg-muted mt-1.5 line-clamp-2">{previewData.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-fg-muted" htmlFor="customName">
                      Feed Title (Editable)
                    </label>
                    <input
                      id="customName"
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. OpenAI News"
                      className="w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-sm text-fg focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-fg-muted" htmlFor="confirmedUrl">
                        Feed URL (HTTPS)
                      </label>
                      <button
                        onClick={() => {
                          setPreviewData(null);
                          setModalError("");
                        }}
                        className="text-xs text-accent hover:underline font-medium"
                      >
                        Change URL
                      </button>
                    </div>
                    <input
                      id="confirmedUrl"
                      type="url"
                      value={previewData.url}
                      readOnly
                      className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-xs font-mono text-fg-muted cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              {/* Error box */}
              {modalError && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs font-medium text-red-400">
                  {modalError}
                </div>
              )}
            </div>

            {/* Modal Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-fg-muted hover:bg-surface-hover hover:text-fg transition-colors"
              >
                Cancel
              </button>

              {!previewData ? (
                /* Step 1 Button: Fetch Info */
                <button
                  onClick={() => handlePreviewFeed()}
                  disabled={isPreviewing || !inputUrl.trim()}
                  className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-dim disabled:opacity-50 transition-colors"
                >
                  {isPreviewing ? "Fetching..." : "Fetch Info"}
                </button>
              ) : (
                /* Step 2 Button: Save Feed (replaces Fetch Info) */
                <button
                  onClick={handleSaveFeed}
                  disabled={isSaving || !customName.trim()}
                  className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-dim disabled:opacity-50 transition-colors"
                >
                  {isSaving ? "Saving..." : "Save Feed"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
