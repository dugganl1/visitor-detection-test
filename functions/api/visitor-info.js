export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const ip = url.searchParams.get("testip") || context.request.headers.get("cf-connecting-ip");
    const country = context.request.headers.get("cf-ipcountry");

    return new Response(
      JSON.stringify({
        ip: ip,
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
