export interface RssFeedInfo {
  title: string;
  description: string;
  link: string;
  url: string;
}

export interface RssFeedItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  summary: string;
}

/**
 * Clean string by removing CDATA wrappers, stripping HTML tags, and decoding common entities.
 */
export function cleanText(input: string | null | undefined): string {
  if (!input) return "";

  // 1. Remove CDATA
  let text = input.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1");

  // 2. Strip HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // 3. Decode HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");

  // 4. Collapse whitespace
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Extract raw text content inside a specific XML tag from a block of XML.
 */
function extractTagContent(xmlBlock: string, tagName: string): string {
  // Try matching standard opening/closing tags or namespace prefixed tags
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = xmlBlock.match(regex);
  if (match && match[1]) {
    return cleanText(match[1]);
  }
  return "";
}

/**
 * Extract link attribute or content (handles RSS <link>http...</link> and Atom <link href="http..."/>)
 */
function extractLink(xmlBlock: string): string {
  // Check for Atom style href attribute
  const hrefMatch = xmlBlock.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
  if (hrefMatch && hrefMatch[1]) {
    return hrefMatch[1].trim();
  }

  // Check for RSS style content
  const linkContent = extractTagContent(xmlBlock, "link");
  if (linkContent) {
    return linkContent.trim();
  }

  // Check for guid if it's a URL
  const guid = extractTagContent(xmlBlock, "guid");
  if (guid.startsWith("http://") || guid.startsWith("https://")) {
    return guid.trim();
  }

  return "";
}

/**
 * Fetch raw XML string from an RSS or Atom feed URL.
 */
export async function fetchFeedXml(url: string): Promise<string> {
  // Add protocol if missing
  let targetUrl = url.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PersonalApp-RSS/1.0",
        Accept: "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const xml = await res.text();
    return xml;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse feed-level metadata (title, description, site link).
 */
export function parseFeedInfo(xml: string, originalUrl: string): RssFeedInfo {
  const cleanXml = (xml || "").trim();
  const lowerXml = cleanXml.toLowerCase();

  // Validate that response is XML and contains RSS or Atom root tags
  const isHtml = lowerXml.startsWith("<!doctype html") || lowerXml.includes("<html");
  const hasXmlTags = lowerXml.includes("<rss") || lowerXml.includes("<feed") || lowerXml.includes("<channel") || lowerXml.includes("<entry");

  if (isHtml || !hasXmlTags) {
    throw new Error("The provided URL is not a valid RSS or Atom XML feed.");
  }

  // Detect if Atom or RSS
  const isAtom = lowerXml.includes("<feed") && !lowerXml.includes("<rss");

  let title = "";
  let description = "";
  let link = "";

  if (isAtom) {
    const feedBlockMatch = xml.match(/<feed[^>]*>([\s\S]*?)<entry>/i) || xml.match(/<feed[^>]*>([\s\S]*?)<\/feed>/i);
    const feedHeader = feedBlockMatch ? feedBlockMatch[1] : xml;

    title = extractTagContent(feedHeader, "title");
    description = extractTagContent(feedHeader, "subtitle") || extractTagContent(feedHeader, "rights");
    link = extractLink(feedHeader);
  } else {
    // RSS 2.0
    const channelBlockMatch = xml.match(/<channel[^>]*>([\s\S]*?)<item>/i) || xml.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
    const channelHeader = channelBlockMatch ? channelBlockMatch[1] : xml;

    title = extractTagContent(channelHeader, "title");
    description = extractTagContent(channelHeader, "description");
    link = extractLink(channelHeader);
  }

  // Fallback title if missing
  if (!title) {
    try {
      const parsed = new URL(originalUrl);
      title = parsed.hostname;
    } catch {
      title = "Untitled RSS Feed";
    }
  }

  let siteLink = link.trim();
  if (!siteLink || siteLink === originalUrl || siteLink.endsWith(".xml") || siteLink.endsWith("/rss")) {
    try {
      siteLink = new URL(originalUrl).origin;
    } catch {
      siteLink = originalUrl;
    }
  }

  return {
    title: title.trim(),
    description: description.trim(),
    link: siteLink,
    url: originalUrl,
  };
}

/**
 * Parse items/articles array from feed XML.
 */
export function parseFeedItems(xml: string): RssFeedItem[] {
  const items: RssFeedItem[] = [];

  // Detect Atom vs RSS
  const isAtom = xml.includes("<feed") && !xml.includes("<rss");

  if (isAtom) {
    const entryMatches = xml.matchAll(/<entry[^>]*>([\s\S]*?)<\/entry>/gi);
    let index = 0;
    for (const match of entryMatches) {
      const block = match[1];
      const title = extractTagContent(block, "title") || "Untitled Article";
      const link = extractLink(block);
      const pubDateRaw =
        extractTagContent(block, "published") ||
        extractTagContent(block, "updated") ||
        "";

      const summaryRaw =
        extractTagContent(block, "summary") ||
        extractTagContent(block, "content") ||
        extractTagContent(block, "description") ||
        extractTagContent(block, "content:encoded") ||
        extractTagContent(block, "media:description") ||
        "";

      const id = extractTagContent(block, "id") || link || `entry-${index}`;

      items.push({
        id,
        title,
        link,
        pubDate: pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString(),
        summary: cleanText(summaryRaw).slice(0, 300), // first 300 chars preview
      });
      index++;
    }
  } else {
    // RSS 2.0
    const itemMatches = xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/gi);
    let index = 0;
    for (const match of itemMatches) {
      const block = match[1];
      const title = extractTagContent(block, "title") || "Untitled Article";
      const link = extractLink(block);
      const pubDateRaw =
        extractTagContent(block, "pubDate") ||
        extractTagContent(block, "dc:date") ||
        "";

      const summaryRaw =
        extractTagContent(block, "description") ||
        extractTagContent(block, "content:encoded") ||
        extractTagContent(block, "summary") ||
        extractTagContent(block, "content") ||
        extractTagContent(block, "media:description") ||
        "";

      const id = extractTagContent(block, "guid") || link || `item-${index}`;

      items.push({
        id,
        title,
        link,
        pubDate: pubDateRaw ? formatDateSafe(pubDateRaw) : new Date().toISOString(),
        summary: cleanText(summaryRaw).slice(0, 300),
      });
      index++;
    }
  }

  return items;
}

function formatDateSafe(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {
    // ignore
  }
  return new Date().toISOString();
}
