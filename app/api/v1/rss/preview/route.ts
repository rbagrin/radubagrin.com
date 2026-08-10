import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchFeedXml, parseFeedInfo } from "@/lib/rss";

/**
 * POST /api/v1/rss/preview
 * Fetches feed XML from the provided URL, parses feed metadata (title, description),
 * and returns it so the user can verify/edit the name before saving.
 */
export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "RSS feed URL is required" },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    try {
      const parsedUrl = new URL(trimmedUrl);
      if (parsedUrl.protocol !== "https:") {
        return NextResponse.json(
          { error: "URL must start with https://" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Please enter a valid https:// URL" },
        { status: 400 }
      );
    }

    const xml = await fetchFeedXml(trimmedUrl);
    const info = parseFeedInfo(xml, trimmedUrl);

    // Check if feed URL is already saved by this user
    const existingFeed = await db.rssFeed.findFirst({
      where: { userId: user.userId, url: trimmedUrl },
    });

    if (existingFeed) {
      return NextResponse.json(
        { error: `You have already saved this feed as "${existingFeed.name}".` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      url: info.url,
      title: info.title,
      description: info.description,
      link: info.link,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch or parse RSS feed preview" },
      { status: 422 }
    );
  }
}
