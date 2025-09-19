import "./styles.css";

const searchForm = document.querySelector("#search-form");
const displayDiv = document.querySelector(".info-container");
const unitToggle = document.querySelector(".unit-toggle");
let currentUnit = "C";
let currentData = null;

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const textInput = searchForm.querySelector("#location-input");
    if (!textInput || textInput.value === "") return;
    fetchWeather(textInput.value);
    searchForm.reset();
});

unitToggle.addEventListener("click", (e) => {
    const clicked = e.target.closest(".option");
    if (!clicked) return;

    unitToggle.dataset.unit = clicked.dataset.value;
    unitToggle.querySelectorAll(".option").forEach(opt =>
        opt.classList.toggle("active", opt === clicked)
    );

    currentUnit = unitToggle.dataset.unit;
    if(currentData) renderData(currentData);
});


async function getWeatherData(location) {
    if (!location) return;

    const apiKey = "299c515348484e4db1795648251909";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            showError();
        }

        const weatherData = await response.json();

        currentData = processData(weatherData);
        renderData(currentData);

    } catch (error) {
        console.error("Failed to get weather data");
    }
}

function showError() {
    displayDiv.textContent = "Location not found";
}

function processData(data) {
    const myData = {
        condition: {
            text: data.current.condition.text,
            icon: data.current.condition.icon
        },
        currentTemp: {
            metric: Math.floor(data.current.temp_c),
            imperial: Math.floor(data.current.temp_f),
        },
        feelsLike: {
            metric: Math.floor(data.current.feelslike_c),
            imperial: Math.floor(data.current.feelslike_f),
        },
        windSpeed: {
            metric: Math.floor(data.current.wind_kph),
            imperial: Math.floor(data.current.wind_mph),
        },
        humidity: data.current.humidity,
        region: data.location.region,
        country: data.location.country
    }

    return myData;
}

function renderData(data) {
    const weatherIcon = displayDiv.querySelector(".weather-icon");
    const condition = displayDiv.querySelector(".condition");
    const location = displayDiv.querySelector(".location");
    const temperature = displayDiv.querySelector(".temperature");
    const feel = displayDiv.querySelector(".feel");
    const wind = displayDiv.querySelector(".wind");
    const humidity = displayDiv.querySelector(".humidity");

    weatherIcon.setAttribute("src", data.condition.icon);
    condition.textContent = data.condition.text;
    location.textContent = `${data.region}, ${data.country}`;
    humidity.textContent = `Humidity: ${data.humidity}%`;
    if (currentUnit === "C") {
        temperature.innerHTML = `${data.currentTemp.metric}<sup>&deg;C</sup>`;
        feel.innerHTML = `Feels Like: ${data.feelsLike.metric}<sup>&deg;C</sup>`;
        wind.textContent = `Wind: ${data.windSpeed.metric} KMH`;
    } else {
        temperature.innerHTML = `${data.currentTemp.imperial}<sup>&deg;F</sup>`;
        feel.innerHTML = `Feels Like: ${data.feelsLike.imperial}<sup>&deg;F</sup>`;
        wind.textContent = `Wind: ${data.windSpeed.imperial} MPH`;
    }

}

function fetchWeather(location) {
    const input = location.trim();
    getWeatherData(input);
}

fetchWeather("Manila");