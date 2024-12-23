// session-tracker.js
function trackPageView() {
  // Get current session ID or create new one
  let sessionId = getCookie("session_id");
  let sessionStart = getCookie("session_start");

  if (!sessionId) {
    sessionId = "s_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    sessionStart = new Date().toISOString(); // This is correct
    // These cookies should be session cookies (no expiry date)
    setCookie("session_id", sessionId);
    setCookie("session_start", sessionStart);
  }

  // Track pages viewed this session
  let pagesViewed = getCookie("pages_viewed_session") || "";
  let currentPage = window.location.pathname;
  pagesViewed = pagesViewed ? `${pagesViewed},${currentPage}` : currentPage;
  setCookie("pages_viewed_session", pagesViewed);

  return {
    sessionId,
    sessionStart: sessionStart || new Date().toISOString(), // Add fallback
    pagesViewed: pagesViewed.split(","),
  };
}

function displaySessionInfo() {
  const sessionInfo = trackPageView();
  const resultHtml = `
        <h3>Session Tracking Info:</h3>
        <p>Session ID: ${sessionInfo.sessionId}</p>
        <p>Session Started: ${
          sessionInfo.sessionStart
            ? new Date(sessionInfo.sessionStart).toLocaleString()
            : "Just now"
        }</p>
        <p>Pages Viewed This Session: ${sessionInfo.pagesViewed.length}</p>
        <p>Navigation Path: ${sessionInfo.pagesViewed.join(" → ")}</p>
    `;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML += resultHtml;
}
