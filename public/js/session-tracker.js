// session-tracker.js
function setSessionCookie(name, value) {
  // Session cookie - expires when browser closes
  document.cookie = `${name}=${value};path=/`;
}

function trackPageView() {
  // Get current session ID or create new one
  let sessionId = getCookie("session_id");
  if (!sessionId) {
    sessionId = "s_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    setSessionCookie("session_id", sessionId);
  }

  // Track pages viewed this session
  let pagesViewed = getCookie("pages_viewed_session") || "";
  let currentPage = window.location.pathname;
  pagesViewed = pagesViewed ? `${pagesViewed},${currentPage}` : currentPage;
  setSessionCookie("pages_viewed_session", pagesViewed);

  return {
    sessionId,
    pagesViewed: pagesViewed.split(","),
  };
}

function displaySessionInfo() {
  const sessionInfo = trackPageView();
  const resultHtml = `
        <h3>Session Tracking Info:</h3>
        <p>Session ID: ${sessionInfo.sessionId}</p>
        <p>Pages Viewed This Session: ${sessionInfo.pagesViewed.length}</p>
        <p>Navigation Path: ${sessionInfo.pagesViewed.join(" → ")}</p>
    `;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML += resultHtml;
}
