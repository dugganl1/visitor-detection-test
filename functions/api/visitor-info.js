export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const ip = url.searchParams.get("testip") || context.request.headers.get("cf-connecting-ip");

    let ipData = null;
    if (context.env.IPINFO_TOKEN) {
      // Using basic IP lookup instead of company endpoint
      const response = await fetch(`https://ipinfo.io/${ip}?token=${context.env.IPINFO_TOKEN}`);
      if (response.ok) {
        ipData = await response.json();
      }
    }

    return new Response(
      JSON.stringify({
        requestInfo: {
          ip: ip,
          country: context.request.headers.get("cf-ipcountry"),
          userAgent: context.request.headers.get("user-agent"),
          timestamp: new Date().toISOString(),
        },
        ipInfo: ipData,
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
