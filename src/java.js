// Code to fetch the date and display it as desired
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDay = days[now.getDay()];
function toAmPm() {
  let currentHour = now.getHours();
  if (currentHour > 12) {
    currentHour = currentHour - 12;
    return [currentHour, "pm"];
  } else {
    return [currentHour, "am"];
  }
}
let currentHour = toAmPm();
let currentMinutes = now.getMinutes();
if (currentMinutes < 10) {
  currentMinutes = `0${currentMinutes}`;
}

let header = document.querySelector("header");
header.innerHTML = `${currentDay}, ${currentHour[0]}:${currentMinutes} ${currentHour[1]}`;

// Code to give current Temperature in Celcius or Fahrenheit when clicked
function getCelciusTemp() {
  event.preventDefault();
  let h2 = document.querySelector("h2");
  h2.innerHTML = "17";
}

let showCelcius = document.querySelector("#celcius-temp");
showCelcius.addEventListener("click", getCelciusTemp);

function getFahrenheitTemp() {
  event.preventDefault();
  let h2 = document.querySelector("h2");
  h2.innerHTML = "63";
}

let showFahrenheit = document.querySelector("#fahrenheit-temp");
showFahrenheit.addEventListener("click", getFahrenheitTemp);

//Code to update name, temperature, humidity and wind on webpage according city user input
function updateCity(result) {
  document.querySelector("h1").innerHTML = result.data.name;
  document.querySelector("h2").innerHTML = Math.round(result.data.main.temp);
  document.querySelector("#current-humidity").innerHTML =
    result.data.main.humidity;
  document.querySelector("#current-wind").innerHTML = Math.round(
    result.data.wind.speed
  );
}

let apiKey = "7682c2be43d876a63c355131eaac1953";
let defaultCityApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Lisbon&appid=${apiKey}&units=metric`;

axios.get(defaultCityApiUrl).then(updateCity);

// Code to get data for city according user input
function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-input-form").value;
  let cityApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=metric`;
  axios.get(cityApiUrl).then(updateCity);
}

let form = document.querySelector("#city-search-form");
form.addEventListener("submit", searchCity);

// Code to get data of current Location

function coordUpdateCity(position) {
  let updatedApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(updatedApiUrl).then(updateCity);
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(coordUpdateCity);
}

let button = document.querySelector("button");
button.addEventListener("click", getPosition);
