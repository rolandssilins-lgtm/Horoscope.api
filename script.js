async function getHoroscope() {
  const sign = document.getElementById("sign").value;
  const resultElement = document.getElementById("result");
  //personalized styles:
  const body = document.body;
  const allSigns = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ];

  body.className = body.className
    .split(" ")
    .filter((c) => !allSigns.includes(c))
    .join(" ");

  resultElement.innerHTML = `
  <div>"Fetching horoscope..."</div>
  <div class="loader"></div> 
  `;

  body.classList.add(sign);

  const originalUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`;
  const proxyUrl = "https://corsproxy.io/?";
  const url = proxyUrl + encodeURIComponent(originalUrl);

  // for testing purposes with live server change originalUrl with url
  try {
    const response = await fetch(originalUrl);

    // --- API Error Handling---
    if (!response.ok) {
      let errorMessage = `An unexpected API error occurred for sign: ${sign}.`;
      console.error(`[API ERROR] Status: ${response.status}. URL: ${url}`);

      switch (response.status) {
        case 404: // Not Found
          errorMessage =
            "❌ Horoscope Not Found: The data for this sign/day is currently unavailable.";
          break;
        case 429: // Too Many Requests (Rate Limiting)
          errorMessage =
            "⏱️ Too Many Requests: You have hit the rate limit. Please wait a moment and try again.";
          break;
        case 500: // Internal Server Error
          errorMessage =
            "🔥 Server Error: The horoscope service is temporarily down. Please try again later.";
          break;
        default:
          errorMessage = `🛑 Unexpected API Error: Received status code ${response.status}.`;
          break;
      }

      throw new Error(errorMessage);
    }

    // --- Data Processing ---
    const textData = await response.text();

    let data;
    try {
      data = JSON.parse(textData);
    } catch (e) {
      console.error(
        "[PARSING ERROR] Response received but failed to parse as JSON:",
        textData
      );
      throw new Error(
        "⚠️ Data Error: Failed to process the horoscope information."
      );
    }

    // --- Data Structure Error Handling ---
    if (!data || !data.data || !data.data.horoscope_data) {
      console.error(
        "[DATA STRUCTURE ERROR] Expected horoscope path not found:",
        data
      );
      throw new Error(
        "🔭 Data Format Error: Horoscope data is missing or in an unexpected format."
      );
    }

    // --- Success ---
    resultElement.innerHTML = `
      <h3>${sign.toUpperCase()} — ${data.data.date}</h3>
      <p>${data.data.horoscope_data}</p>
    `;
  } catch (error) {
    // --- Network Failure & Catch-All Error Handling ---

    //no internet, timeout
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error(
        "[NETWORK FAILURE] Failed to fetch resource:",
        error.message
      );

      // User-facing message for network failure
      const networkErrorMessage =
        "🌍 Connection Lost: Could not reach the horoscope service. Check your internet connection or try again later.";
      resultElement.innerHTML = `<p class='error'>${networkErrorMessage}</p>`;
    } else {
      // Handle the errors thrown from within the 'try' block (HTTP, JSON, Data Structure)

      if (!error.message.includes("Status:")) {
        console.error(
          "[GENERAL ERROR] Uncaught error during horoscope fetch:",
          error
        );
      }

      // Use the descriptive message already contained in the error
      resultElement.innerHTML = `<p class='error'>❌ Error for ${sign.toUpperCase()}: ${
        error.message
      }</p>`;
    }
  }
}
