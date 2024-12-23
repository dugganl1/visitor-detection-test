export async function onRequest(context) {
  try {
    // Get basic Cloudflare data
    const ip = context.request.headers.get("cf-connecting-ip");
    const country = context.request.headers.get("cf-ipcountry");

    // Get IPinfo enrichment
    const ipinfoToken = context.env.IPINFO_TOKEN;
    const ipinfoResponse = await fetch(`https://ipinfo.io/${ip}?token=${ipinfoToken}`);
    const ipinfoData = await ipinfoResponse.json();

    return new Response(
      JSON.stringify({
        ip: ip,
        country: country,
        countryName: country ? new Intl.DisplayNames(["en"], { type: "region" }).of(country) : null,
        hostname: ipinfoData.hostname,
        org: ipinfoData.org,
        asn: ipinfoData.asn,
        privacy: ipinfoData.privacy,
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
