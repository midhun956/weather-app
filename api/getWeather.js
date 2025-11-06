/**
 * Vercel Serverless Function: /api/getWeather
 *
 * This function acts as a secure proxy for the OpenWeatherMap API.
 * It handles three types of requests based on query parameters:
 * 1. ?search=... : Calls the Geo API for city suggestions.
 * 2. ?city=...   : Calls the Weather and Forecast APIs by city name.
 * 3. ?lat=...&lon=... : Calls the Weather and Forecast APIs by coordinates.
 *
 * It securely accesses the API key from Vercel Environment Variables.
 */

export default async function handler(request, response) {
    // Get the API key securely from environment variables
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    // Check if the API key is set
    if (!OPENWEATHER_API_KEY) {
        return response.status(500).json({ 
            message: "OpenWeatherMap API key is not set" 
        });
    }

    const { search, city, lat, lon } = request.query;

    try {
        // --- Re-added search functionality ---
        if (search) {
            // Use encodeURIComponent for the search query
            const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(search)}&limit=5&appid=${OPENWEATHER_API_KEY}`;
            const geoResponse = await fetch(geoApiUrl);
            
            if (!geoResponse.ok) {
                const errorData = await geoResponse.json();
                const statusCode = geoResponse.status;
                // Forward the error from the Geo API
                return response.status(statusCode).json({ message: errorData.message || 'Failed to fetch from OpenWeather Geo API' });
            }
            
            const citySuggestions = await geoResponse.json();
            // Return the suggestions directly
            return response.status(200).json(citySuggestions);
        }

        // --- Main Weather Fetching ---
        let weatherApiUrl = '';
        let forecastApiUrl = '';

        if (city) {
            // Use encodeURIComponent for the city name
            weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
            forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        } else if (lat && lon) {
            weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
            forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        } else {
            return response.status(400).json({ message: "Missing required query parameters (city or lat/lon)" });
        }

        // Use Promise.all to fetch both current weather and forecast simultaneously
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherApiUrl),
            fetch(forecastApiUrl)
        ]);

        // Check for errors in the main weather response
        if (!weatherResponse.ok) {
            const errorData = await weatherResponse.json();
            const statusCode = weatherResponse.status; // e.g., 404
            const errorMessage = errorData.message || 'City not found';
            // Send back the specific error message from OpenWeather
            return response.status(statusCode).json({ message: errorMessage });
        }

        // Check for errors in the forecast response (less critical, but good to check)
        if (!forecastResponse.ok) {
            const errorData = await forecastResponse.json();
            // Log this error but maybe don't fail the whole request
            console.error("Forecast fetch failed:", errorData.message);
            // If the main weather call succeeded, we might still want to proceed
            // For now, we'll fail if either fails.
            return response.status(forecastResponse.status).json({ message: errorData.message || 'Failed to fetch forecast' });
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        // Send both sets of data back to the client
        return response.status(200).json({ weatherData, forecastData });

    } catch (error) {
        return response.status(500).json({ message: error.message || 'An internal server error occurred' });
    }
}