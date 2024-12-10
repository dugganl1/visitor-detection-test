export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    if (url.pathname === "/api/visitor-info") {
      const ip = request.headers.get("cf-connecting-ip");
      const country = request.headers.get("cf-ipcountry");

      return new Response(
        JSON.stringify({
          ip,
          country,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
