export async function onRequest(context) {
  try {
    const ip = context.request.headers.get("cf-connecting-ip");
    const country = context.request.headers.get("cf-ipcountry");
    const city = context.request.headers.get("cf-ipcity"); // Add this!
    const region = context.request.headers.get("cf-region"); // Can add region too

    return new Response(
      JSON.stringify({
        ip: ip,
        city: city,
        region: region,
        country: country,
        countryName: new Intl.DisplayNames(["en"], { type: "region" }).of(country),
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
