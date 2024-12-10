export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static files
    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    // Handle API requests
    if (url.pathname === "/api/visitor-info") {
      const ip = request.headers.get("cf-connecting-ip");
      const country = request.headers.get("cf-ipcountry");

      try {
        // Only attempt IPinfo request if we have an API token
        let companyData = null;
        if (env.IPINFO_TOKEN) {
          const response = await fetch(`https://ipinfo.io/${ip}/company?token=${env.IPINFO_TOKEN}`);
          if (response.ok) {
            companyData = await response.json();
          }
        }

        return new Response(
          JSON.stringify({
            ip,
            country,
            company: companyData,
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get("user-agent"),
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-store",
            },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: "Failed to fetch visitor information",
            ip,
            country,
            timestamp: new Date().toISOString(),
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-store",
            },
          }
        );
      }
    }

    // Handle unknown API routes
    return new Response("Not Found", { status: 404 });
  },
};
