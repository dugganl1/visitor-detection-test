// visitor-info.js
export async function onRequest(context) {
  try {
    // First log the full URL and parameters for debugging
    const url = new URL(context.request.url);
    console.log("Full URL:", url.toString());

    // Get the test IP and log it
    const testIp = url.searchParams.get("ip");
    console.log("Test IP from URL:", testIp);

    // CRITICAL: We must explicitly check for testIp before using cf-connecting-ip
    let ipToUse;
    if (testIp && testIp.length > 0) {
      ipToUse = testIp;
      console.log("Using test IP:", ipToUse);
    } else {
      ipToUse = context.request.headers.get("cf-connecting-ip");
      console.log("Using real IP:", ipToUse);
    }

    // Get IPinfo data
    const ipinfoToken = context.env.IPINFO_TOKEN;
    const ipinfoResponse = await fetch(`https://ipinfo.io/${ipToUse}?token=${ipinfoToken}`);
    const ipinfoData = await ipinfoResponse.json();

    console.log("IPinfo response:", ipinfoData);

    const responseData = {
      isTest: !!testIp,
      requestedTestIp: testIp || null,
      actualIpUsed: ipToUse,
      fullUrl: url.toString(),
      ipinfoData: ipinfoData,
      // Formatted data
      ip: ipToUse,
      country: ipinfoData.country,
      countryName: ipinfoData.country
        ? new Intl.DisplayNames(["en"], { type: "region" }).of(ipinfoData.country)
        : null,
      hostname: ipinfoData.hostname,
      org: ipinfoData.org,
      asn: ipinfoData.asn,
      privacy: ipinfoData.privacy,
      raw: ipinfoData,
    };

    return new Response(JSON.stringify(responseData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        url: context.request.url,
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
