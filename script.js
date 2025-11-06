async function getHoroscope() {
  const sign = document.getElementById("sign").value;

  const originalUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`;
  const proxyUrl = "https://corsproxy.io/?";

  //live server doesn't get the info for scurity reasons so we use a free proxy
  const url = proxyUrl + encodeURIComponent(originalUrl);

  const response = await fetch(url);
  const textData = await response.text();
  const data = JSON.parse(textData);

  document.getElementById("result").innerHTML = `
                <h3>${sign.toUpperCase()} — ${data.data.date}</h3>
                <p>${data.data.horoscope_data}</p>
            `;
}
