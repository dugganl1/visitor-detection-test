export async function onRequest(context) {
  try {
    const ip = context.request.headers.get("cf-connecting-ip");
    const country = context.request.headers.get("cf-ipcountry");

    let companyData = null;
    if (context.env.IPINFO_TOKEN) {
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
