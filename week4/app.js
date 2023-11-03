let button = document.getElementById("btn");
const APIKEY = "bee0068e828c2ebe12b0b8eba9a6348d";

button.addEventListener("click", function(e) {
    e.preventDefault();
    const inputcity = document.getElementById("cityInput").value;
    getweather(inputcity);
});

function getweather(inputcity) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputcity}&APPID=7e3814742feaa8db91bc56c1e6b14425&units=metric`)
    .then(response => response.json())
    .then(data => {
        const weatherinfo = document.getElementById("weather-info");

        weatherinfo.textContent = `Country: ${inputcity}, Temperature: ${data.main.temp}°C, Weather: ${data.weather[0].description}, Wind: ${data.wind.speed}m/s`;
    })
    .catch(error => {
        console.log(error);
    });
}