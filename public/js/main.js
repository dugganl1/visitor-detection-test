function displayVisitorInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const testIp = urlParams.get("ip");
  const apiUrl = testIp ? `/api/visitor-info?ip=${testIp}` : "/api/visitor-info";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Received data:", data);
      const resultHtml = `
        <h3>IP Analytics:</h3>
        <p>IP Address: ${data.ip}</p>
        <p>Hostname: ${data.raw.hostname || "Unknown"}</p>
        <p>Country: ${data.countryName || "Unknown"}</p>
        <p>City: ${data.raw.city || "Unknown"}</p>
        <p>Region: ${data.raw.region || "Unknown"}</p>
        <p>Network Organization: ${data.raw.org || "Unknown"}</p>
        <p>Timezone: ${data.raw.timezone || "Unknown"}</p>
        <p>Location: ${data.raw.loc || "Unknown"}</p>
        <p>Postal Code: ${data.raw.postal || "Unknown"}</p>

        ${
          data.isTest
            ? `
          <h3>Raw IPinfo Data:</h3>
          <pre style="background-color: #f5f5f5; padding: 10px; overflow-x: auto;">
${JSON.stringify(data.raw, null, 2)}
          </pre>
        `
            : ""
        }
      `;
      document.getElementById("result").innerHTML = resultHtml;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById(
        "result"
      ).innerHTML = `Error loading visitor information: ${error.message}`;
    });
}

displayVisitorInfo().then(() => {
  displayTrackingInfo();
  displaySessionInfo();
});
