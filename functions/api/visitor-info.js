export async function onRequest(context) {
  try {
    // Get all available Cloudflare headers for geolocation
    const headers = {
      ip: context.request.headers.get("cf-connecting-ip"),
      city: context.request.headers.get("cf-ipcity"),
      region: context.request.headers.get("cf-region"),
      country: context.request.headers.get("cf-ipcountry"),
      // Let's also get these additional headers
      latitude: context.request.headers.get("cf-iplatitude"),
      longitude: context.request.headers.get("cf-iplongitude"),
      continent: context.request.headers.get("cf-ipcontinent"),
      timezone: context.request.headers.get("cf-timezone"),
    };

    return new Response(
      JSON.stringify({
        ...headers,
        countryName: headers.country
          ? new Intl.DisplayNames(["en"], { type: "region" }).of(headers.country)
          : null,
        timestamp: new Date().toISOString(),
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
    // ... error handling
  }
}
