export async function onRequest(context) {
  try {
    const country = context.request.headers.get("cf-ipcountry");

    return new Response(
      JSON.stringify({
        country: country,
        countryName: country ? new Intl.DisplayNames(["en"], { type: "region" }).of(country) : null,
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
