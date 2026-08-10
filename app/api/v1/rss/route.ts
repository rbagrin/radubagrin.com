import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/v1/rss
 * Returns list of saved RSS feeds for the authenticated user.
 */
export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const feeds = await db.rssFeed.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ feeds });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch saved feeds" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/rss
 * Saves a new RSS feed for the authenticated user.
 * Expects JSON body: { name: string, url: string }
 */
export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Feed URL is required" },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();
    if (!cleanUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "URL must start with https://" },
        { status: 400 }
      );
    }

    const cleanName = (name && typeof name === "string" && name.trim()) || cleanUrl;

    // Check if feed URL is already saved by this user
    const existingFeed = await db.rssFeed.findFirst({
      where: { userId: user.userId, url: cleanUrl },
    });

    if (existingFeed) {
      return NextResponse.json(
        { error: `You have already saved this feed as "${existingFeed.name}".` },
        { status: 400 }
      );
    }

    const feed = await db.rssFeed.create({
      data: {
        userId: user.userId,
        name: cleanName,
        url: cleanUrl,
      },
    });

    return NextResponse.json({ feed }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to save RSS feed" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/rss?id=<feedId>
 * Deletes a saved RSS feed belonging to the authenticated user.
 */
export async function DELETE(request: Request) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Feed ID is required" }, { status: 400 });
    }

    // Ensure feed belongs to user
    const existing = await db.rssFeed.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Feed not found" }, { status: 404 });
    }

    await db.rssFeed.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Feed removed" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete RSS feed" },
      { status: 500 }
    );
  }
}
