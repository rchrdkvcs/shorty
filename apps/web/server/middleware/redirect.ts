export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  // Ignore known routes and paths
  const ignoredPrefixes = [
    "/_nuxt",
    "/api",
    "/adonis",
    "/__nuxt",
    "/favicon",
    "/assets",
  ];

  const ignoredRoutes = ["/", "/links", "/login"];

  // Skip if path starts with ignored prefix
  if (ignoredPrefixes.some((prefix) => path.startsWith(prefix))) {
    return;
  }

  // Skip if path matches an ignored route exactly
  if (ignoredRoutes.includes(path)) {
    return;
  }

  // Extract potential slug (remove leading slash)
  const slug = path.slice(1);

  // Skip if slug contains slashes (nested path) or is empty
  if (!slug || slug.includes("/")) {
    return;
  }

  const apiUrl = process.env.NUXT_PUBLIC_API_URL || "http://localhost:3333";

  try {
    const link = await $fetch<{ targetUrl: string }>(`${apiUrl}/r/${slug}`);

    return sendRedirect(event, link.targetUrl, 302);
  } catch {
    // Link not found, let Nuxt handle it (will show 404)
    return;
  }
});