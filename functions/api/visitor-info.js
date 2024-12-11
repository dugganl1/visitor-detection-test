export async function onRequest(context) {
  try {
    // Get URL parameters
    const url = new URL(context.request.url);
    // Use test IP if provided in query param, otherwise use real visitor IP
    const ip = url.searchParams.get("testip") || context.request.headers.get("cf-connecting-ip");
    const country = context.request.headers.get("cf-ipcountry");

    let companyData = null;
    if (context.env.IPINFO_TOKEN) {
      // Test with known corporate IPs:
      // Google: 8.8.8.8
      // Microsoft: 20.112.52.29
      // Amazon: 176.32.103.205
      const response = await fetch(
        `https://ipinfo.io/${ip}/company?token=${context.env.IPINFO_TOKEN}`
      );
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
        userAgent: context.request.headers.get("user-agent"),
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
