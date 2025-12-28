document.addEventListener("DOMContentLoaded", () => {

  // Referencias al DOM
  const searchForm = document.getElementById("search-form");
  const cityInput = document.getElementById("city-input");
  const weatherData = document.getElementById("weather-data");
  const loadingMessage = document.getElementById("loading-message");
  const errorMessage = document.getElementById("error-message");

  // Escuchar el envío del formulario
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (!city) return;

    const data = await fetchWeatherData(city);

    console.log("Respuesta OpenWeather:", data);
    if (!data) return;   // ✅ si falló, ya showError se encargó
    renderWeather(data);
  });

  function showLoading() {
    loadingMessage.classList.remove("hidden");
    errorMessage.classList.add("hidden");
  }

  function hideLoading() {
    loadingMessage.classList.add("hidden");
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    loadingMessage.classList.add("hidden");
  }

  function clearWeatherData() {
    weatherData.innerHTML = "";
  }

 async function fetchWeatherData(city) {
  try {
    showLoading();
    clearWeatherData();
    
    //== ⚠️aqui se hace la llamada al backend⚠️==//
    const url = `https://clima-app-backend.onrender.com/api/weather?city=${encodeURIComponent(city)}`;

    /*const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&lang=es&appid=${API_KEY}`;*/
    console.log("🔥 FRONTEND ACTUAL | URL BACKEND:", url);

    const response = await axios.get(url);

    hideLoading();

    // ✅ devolver la data para que el submit la use
    return response.data;

 } catch (error) {
  hideLoading();
  clearWeatherData();

  // Axios: si hay respuesta del servidor (HTTP error)
  if (error.response) {
    if (error.response.status === 404) {
      showError("Ciudad no encontrada. Verifica el nombre e intenta de nuevo.");
    } else {
      showError("La API respondió con un error. Intenta más tarde.");
    }
  }
  // Axios: si hubo request pero no hubo respuesta (red/caída)
  else if (error.request) {
    showError("No hay conexión o no se pudo contactar el servidor. Revisa tu internet.");
  }
  // Otro error (configuración/código)
  else {
    showError("Error inesperado. Intenta de nuevo.");
  }

  return null;
}

}


 function renderWeather(data) {
  hideLoading();
  if (!data) return;

  const city = data.city;
  const temp = Math.round(data.temp);
  const feels = Math.round(data.feels_like);
  const hum = data.humidity;
  const desc = data.description || "";

  weatherData.innerHTML = `
    <h2>${city}</h2>
    <p><strong>Temperatura:</strong> ${temp}°C</p>
    <p><strong>Sensación térmica:</strong> ${feels}°C</p>
    <p><strong>Humedad:</strong> ${hum}%</p>
    <p><strong>Descripción:</strong> ${desc}</p>
  `;
}


});
