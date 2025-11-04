# 🌦️ Modern Weather App

A sleek, responsive weather application built with pure HTML, Tailwind CSS, and JavaScript. This app uses a secure, serverless backend on Vercel to protect the OpenWeatherMap API key.

![weather-app](./images/desktop.png)

## ✨ Features

- **Current Weather**: Get instant weather data, including temperature, "feels like," humidity, wind speed, and sunrise/sunset times.

- **Hourly & 5-Day Forecast**: Plan your week with a scrollable 8-hour hourly forecast and a 5-day daily forecast.

- **Dynamic UI**:

- **Glassmorphism**: A modern, frosted-glass effect for all UI cards.

- **Dynamic Backgrounds**: The app's background gradient changes to match the current weather (e.g., clear day, cloudy night, rain).

- **Smart Search**:

   - **City Search**: Find any city in the world.

    - **Autocomplete**: Get search suggestions as you type.

    - **Geolocation**: Instantly get the weather for your current location with one click.

- **Secure API Calls**: Uses Vercel serverless functions to hide and protect the OpenWeatherMap API key, which is never exposed to the browser.

🛠️ **Tech Stack**

**Frontend**: HTML, Tailwind CSS, Vanilla JavaScript

**Backend**: Vercel Serverless Functions (Node.js)

**API**: OpenWeatherMap (for weather, forecast, and geo-location data)

**Deployment**: Vercel

🚀 **Deployment & Setup**

This project is designed for a secure and straightforward deployment to Vercel.

1. **Fork/Clone the Repository**

First, get a copy of the project on your local machine or in your GitHub account.

2. **Deploy to Vercel**

    1. Sign up for a Vercel account (you can use your GitHub account).

    2. Create a "New Project" and import your forked/cloned repository.

    3. Vercel will automatically detect the file structure and deploy the index.html file.

3. **Add the API Key (CRITICAL STEP)**

    The app will not work until you provide your OpenWeatherMap API key.

    1. Inside your new Vercel project dashboard, go to the Settings tab.

    2. Click on Environment Variables in the side menu.

    3. Create a new variable with the following exact name and value:

        - **Name**: OPENWEATHER_API_KEY

        - **Value**: YOUR_PERSONAL_API_KEY_FROM_OPENWEATHERMAP

    4. Click **Save**.

4. **Redeploy**

After saving the environment variable, you must redeploy the project for the key to be included.

1. Go to the Deployments tab in your Vercel project.

2. Find the most recent deployment, click the "..." menu, and select Redeploy.

Once the new deployment is complete, your app will be live and fully functional!

📁 **File Structure**

The project is intentionally simple:

```
.
├── api/
│   └── getWeather.js   # The Vercel serverless function that securely calls the API.
│
└── index.html          # The complete frontend application (HTML, CSS, and JS).
└── README.md           # You are here!

```