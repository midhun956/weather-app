const apiKey = 'd35ff6b144dc4d77a5575540252505'; // Replace with your real API key

document.addEventListener('DOMContentLoaded', () => {
  const getWeatherBtn = document.getElementById('getWeather');
  const cityInput = document.getElementById('cityInput');
  const weatherResult = document.getElementById('weatherResult');

  function fetchWeather() {
    const city = cityInput.value.trim();

    if (!city) {
      alert("Please enter a city name.");
      return;
    }

    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error.message);
        weatherResult.innerHTML = `
          <h2>${data.location.name}, ${data.location.country}</h2>
          <p>Temperature: ${data.current.temp_c}°C</p>
          <p>Condition: ${data.current.condition.text}</p>
          <img src="https:${data.current.condition.icon}" alt="Weather Icon" />
        `;
      })
      .catch(error => {
        weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
      });
  }

  // Click button to fetch weather
  getWeatherBtn.addEventListener('click', fetchWeather);

  // Press Enter to fetch weather
  cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      fetchWeather();
    }
  });
});
