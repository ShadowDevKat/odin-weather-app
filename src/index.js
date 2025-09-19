import "./styles.css";

async function getWeatherData(location = "China") {
    const apiKey = "299c515348484e4db1795648251909";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location.trim()}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const weatherData = await response.json();
        console.log("Weather data: ", weatherData);
        return weatherData;

    } catch (error) {
        console.error("Failed to get weather data: ", error);
        return null;
    }
}

function throwError() {
    // display error
}

function processData(data) {
    // process data
}

function displayData(data) {
    // Handle display
}

function fetchWeather() {
    // Handle user input
}

getWeatherData();