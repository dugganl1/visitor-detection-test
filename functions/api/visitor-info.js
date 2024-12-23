export async function onRequest(context) {
  try {
    // Check if there's a test IP in the URL
    const url = new URL(context.request.url);
    const testIp = url.searchParams.get("ip");

    // Use test IP if provided, otherwise use real visitor IP
    const ip = testIp || context.request.headers.get("cf-connecting-ip");

    // Only use Cloudflare headers if we're not testing
    const country = testIp ? null : context.request.headers.get("cf-ipcountry");

    console.log("Testing IP:", testIp); // Debug log
    console.log("Using IP:", ip); // Debug log

    // Get IPinfo enrichment
    const ipinfoToken = context.env.IPINFO_TOKEN;
    const ipinfoResponse = await fetch(`https://ipinfo.io/${ip}?token=${ipinfoToken}`);
    const ipinfoData = await ipinfoResponse.json();

    console.log("IPinfo response:", ipinfoData); // Debug log

    return new Response(
      JSON.stringify({
        isTest: !!testIp,
        testIp: testIp, // Added for debugging
        ip: ip,
        country: ipinfoData.country, // Use IPinfo's country when testing
        countryName: ipinfoData.country
          ? new Intl.DisplayNames(["en"], { type: "region" }).of(ipinfoData.country)
          : null,
        hostname: ipinfoData.hostname,
        org: ipinfoData.org,
        asn: ipinfoData.asn,
        privacy: ipinfoData.privacy,
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
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack, // Added for debugging
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}
