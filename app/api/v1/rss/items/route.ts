import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchFeedXml, parseFeedInfo, parseFeedItems } from "@/lib/rss";

/**
 * GET /api/v1/rss/items?url=... OR ?id=...
 * Fetches and parses articles live from the specified RSS feed.
 */
export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  let feedUrl = searchParams.get("url");
  const feedId = searchParams.get("id");

  try {
    if (feedId && !feedUrl) {
      const feedRecord = await db.rssFeed.findFirst({
        where: { id: feedId, userId: user.userId },
      });

      if (!feedRecord) {
        return NextResponse.json({ error: "Feed not found" }, { status: 404 });
      }
      feedUrl = feedRecord.url;
    }

    if (!feedUrl) {
      return NextResponse.json(
        { error: "Feed URL or Feed ID is required" },
        { status: 400 }
      );
    }

    const xml = await fetchFeedXml(feedUrl);
    const info = parseFeedInfo(xml, feedUrl);
    const items = parseFeedItems(xml);

    return NextResponse.json({
      feedTitle: info.title,
      feedDescription: info.description,
      feedLink: info.link,
      items,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch news items from RSS feed" },
      { status: 422 }
    );
  }
}
