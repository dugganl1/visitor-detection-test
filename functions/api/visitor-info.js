export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const ip = url.searchParams.get("testip") || context.request.headers.get("cf-connecting-ip");
    const country = context.request.headers.get("cf-ipcountry");

    let companyData = null;
    let ipinfoResponse = null;

    if (context.env.IPINFO_TOKEN) {
      const response = await fetch(
        `https://ipinfo.io/${ip}/company?token=${context.env.IPINFO_TOKEN}`
      );
      ipinfoResponse = await response.text(); // Get raw response

      if (response.ok) {
        try {
          companyData = JSON.parse(ipinfoResponse);
        } catch (e) {
          companyData = null;
        }
      }
    }

    return new Response(
      JSON.stringify({
        ip,
        country,
        company: companyData,
        ipinfoResponse, // Include raw response for debugging
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
