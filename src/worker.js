export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    console.log("Request path:", url.pathname); // Debug log

    // Handle API requests first
    if (url.pathname === "/api/visitor-info") {
      try {
        const ip = request.headers.get("cf-connecting-ip");
        const country = request.headers.get("cf-ipcountry");

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
            error: error.message,
            timestamp: new Date().toISOString(),
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    // Serve static files for all other requests
    return env.ASSETS.fetch(request);
  },
};
