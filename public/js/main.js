function displayVisitorInfo() {
  // Get the current URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const testIp = urlParams.get("ip");

  // Build the API URL with the test IP if present
  const apiUrl = testIp ? `/api/visitor-info?ip=${testIp}` : "/api/visitor-info";

  console.log("Fetching from:", apiUrl);

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Received data:", data);
      const resultHtml = `
        <h3>IP Analytics:</h3>
        <p>IP Address: ${data.ip}</p>
        <p>Country: ${data.countryName || "Unknown"}</p>
        <p>Network: ${data.org || "Unknown"}</p>
        <p>ASN Details: ${data.asn ? `${data.asn.asn} (${data.asn.name})` : "Unknown"}</p>
        <p>Network Type: ${data.asn?.type || "Unknown"}</p>
        <p>Network Route: ${data.asn?.route || "Unknown"}</p>
        <p>Company Domain: ${data.asn?.domain || "Unknown"}</p>
        ${data.privacy?.vpn ? "<p><strong>VPN Detected</strong></p>" : ""}
        ${data.privacy?.proxy ? "<p><strong>Proxy Detected</strong></p>" : ""}
        ${data.privacy?.tor ? "<p><strong>Tor Detected</strong></p>" : ""}
        ${data.privacy?.hosting ? "<p><strong>Hosting/Datacenter Detected</strong></p>" : ""}

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

displayVisitorInfo();
