export async function onRequest(context) {
  try {
    // Check if there's a test IP in the URL
    const url = new URL(context.request.url);
    const testIp = url.searchParams.get("ip");

    // Use test IP if provided, otherwise use real visitor IP
    const ip = testIp || context.request.headers.get("cf-connecting-ip");
    const country = testIp ? null : context.request.headers.get("cf-ipcountry"); // We won't get Cloudflare headers for test IPs

    // Get IPinfo enrichment
    const ipinfoToken = context.env.IPINFO_TOKEN;
    const ipinfoResponse = await fetch(`https://ipinfo.io/${ip}?token=${ipinfoToken}`);
    const ipinfoData = await ipinfoResponse.json();

    return new Response(
      JSON.stringify({
        isTest: !!testIp,
        ip: ip,
        country: country,
        countryName: ipinfoData.country
          ? new Intl.DisplayNames(["en"], { type: "region" }).of(ipinfoData.country)
          : null,
        hostname: ipinfoData.hostname,
        org: ipinfoData.org,
        asn: ipinfoData.asn,
        privacy: ipinfoData.privacy,
        // Add raw IPinfo response for debugging
        raw: ipinfoData,
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}
