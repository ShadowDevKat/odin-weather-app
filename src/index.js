import "./styles.css";

const searchForm = document.querySelector("#search-form");
const displayDiv = document.querySelector(".info-container");
const toggle = document.querySelector(".unit-toggle");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const textInput = searchForm.querySelector("#location-input");
    if (!textInput || textInput.value === "") return;
    fetchWeather(textInput.value);
    searchForm.reset();
});

toggle.addEventListener("click", (e) => {
  const clicked = e.target.closest(".option");
  if (!clicked) return;

  toggle.dataset.unit = clicked.dataset.value;
  toggle.querySelectorAll(".option").forEach(opt =>
    opt.classList.toggle("active", opt === clicked)
  );

  // here you can trigger unit conversion using toggle.dataset.unit ("C" or "F")
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
        // console.log("Weather data: ", weatherData);

        const formattedData = processData(weatherData);
        renderData(formattedData);

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
    // Metric
    displayDiv.innerHTML = `
    <img src=${data.condition.icon}><br>
    Condition: ${data.condition.text}<br>
    Temperature: ${data.currentTemp.metric}&deg;C<br>
    Feels Like: ${data.feelsLike.metric}&deg;C<br>
    Wind: ${data.windSpeed.metric} km/h<br>
    Humidity: ${data.humidity}%<br>
    Location: ${data.region}, ${data.country}<br>
    `;

    // Imperial
    displayDiv.innerHTML = `
    <img src=${data.condition.icon}><br>
    Condition: ${data.condition.text}<br>
    Temperature: ${data.currentTemp.imperial}&deg;F<br>
    Feels Like: ${data.feelsLike.imperial}&deg;F<br>
    Wind: ${data.windSpeed.imperial} mp/h<br>
    Humidity: ${data.humidity}%<br>
    Location: ${data.region}, ${data.country}<br>
    `;
}

function fetchWeather(location) {
    const input = location.trim();
    getWeatherData(input);
}