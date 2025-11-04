// This file goes in your repository at this exact path: /api/getWeather.js
// It handles all calls to the OpenWeatherMap API.

export default async function handler(request, response) {
    // Get the API key from Vercel's environment variables
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!OPENWEATHER_API_KEY) {
        return response.status(500).json({ message: "OpenWeatherMap API key is not set" });
    }

    const { city, lat, lon, geo } = request.query;
    const units = 'metric';

    try {
        // --- Handle Geo Search (for autocomplete) ---
        if (geo) {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${geo}&limit=5&appid=${OPENWEATHER_API_KEY}`;
            const geoResponse = await fetch(geoUrl);
            if (!geoResponse.ok) {
                const errorData = await geoResponse.json();
                return response.status(geoResponse.status).json(errorData);
            }
            const geoData = await geoResponse.json();
            return response.status(200).json(geoData);
        }

        // --- Handle Weather/Forecast Search ---
        let weatherUrl = '';
        let forecastUrl = '';

        if (city) {
            weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
        } else if (lat && lon) {
            weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
            forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
        } else {
            return response.status(400).json({ message: "Missing city or lat/lon parameters" });
        }

        // Fetch both weather and forecast data in parallel
        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        // Check if either request failed
        if (!weatherRes.ok) {
            const errorData = await weatherRes.json();
            return response.status(weatherRes.status).json(errorData);
        }
         if (!forecastRes.ok) {
            const errorData = await forecastRes.json();
            return response.status(forecastRes.status).json(errorData);
        }

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        // Return both payloads to the frontend
        return response.status(200).json({ weatherData, forecastData });

    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
}

