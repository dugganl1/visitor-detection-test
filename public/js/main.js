function displayVisitorInfo() {
  fetch("/api/visitor-info")
    .then((response) => response.json())
    .then((data) => {
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
      `;
      document.getElementById("result").innerHTML = resultHtml;
    })
    .catch((error) => {
      document.getElementById(
        "result"
      ).innerHTML = `Error loading visitor information: ${error.message}`;
    });
}

// Single API call on page load
displayVisitorInfo();
