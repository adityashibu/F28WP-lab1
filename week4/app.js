let button = document.getElementById("btn");
const APIKEY = "7e3814742feaa8db91bc56c1e6b14425&units";

button.addEventListener("click", function (e) {
    e.preventDefault();
    const inputcity = document.getElementById("cityInput").value;
    getweather(inputcity);
});

function getweather(inputcity) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputcity}&APPID=7e3814742feaa8db91bc56c1e6b14425&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            const weatherinfo = document.getElementById("weather-info");

            // Create a new div element for each weather display
            const weatherDiv = document.createElement("div");

            // Set the content for the weather display
            weatherDiv.innerHTML = `Country: ${inputcity}, Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}, Wind: ${data.wind.speed}m/s`;

            // Add an <hr> element after each weather display
            weatherDiv.innerHTML += "<hr>";

            // Append the weather display to the weatherinfo container
            weatherinfo.insertBefore(weatherDiv, weatherinfo.firstChild);
        })
        .catch((error) => {
            console.log(error);
        });

    if (inputcity === "") {
        alert("Please enter a city");
    }
}
