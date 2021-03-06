//Functions
//Function to Update weather description emoji
function updateIcon(description) {
  let newVar = description.toString();
  if (description == "800") {
    return "fas fa-sun";
  } else {
    newVar = newVar.charAt(0);
  }
  for (index = 1; index < 7; index++) {
    if (iconsLib[index].iconName == newVar) {
      let newClass = `${iconsLib[index].class}`;
      return newClass;
    }
  }
}

//Function to transform time to AM-PM
function toAmPm() {
  let currentHour = now.getHours();
  if (currentHour > 12) {
    currentHour = currentHour - 12;
    return [currentHour, "pm"];
  } else {
    return [currentHour, "am"];
  }
}

//Function to update next days according current one
function nextDays() {
  for (let i = 1; i < 6; i++) {
    let nextDayIndex = now.getDay() + i;
    if (nextDayIndex > 6) {
      nextDayIndex = now.getDay() + i - 7;
    }
    let nextDay = days[nextDayIndex];
    document.querySelector(`#day-${i}`).innerHTML = `${nextDay}`;
  }
}

//Function to transform time (formating)
function transformTime(timeStamp) {
  let date = new Date(timeStamp);
  let currentHour = toAmPm(date.getHours());
  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  let reply = `${days[date.getDay()]}, ${currentHour[0]}:${currentMinutes} ${
    currentHour[1]
  }`;
  return reply;
}

//Function to update emojis for forecast days
function updateEmojis(outcome) {
  let index = outcome[0];
  let newClass = outcome[1];
  document
    .querySelector(`#weatherEmogi-${index}`)
    .setAttribute("class", newClass);
}

//Function to get forecast based on coordinates obtained from current city
function getForecast(result) {
  for (i = 1; i < 6; i++) {
    let maxTemp = Math.round(result.data.daily[i].temp.max);
    let minTemp = Math.round(result.data.daily[i].temp.min);
    document.querySelector(`#max-day-${i}`).innerHTML = maxTemp;
    document.querySelector(`#min-day-${i}`).innerHTML = minTemp;
    let currentClass = updateIcon(result.data.daily[i].weather[0].id);
    let outcome = [i, currentClass];
    updateEmojis(outcome);
  }
}

//Function to get coordinates of current city displayed, for weather forecast
function getCoordinates(result) {
  let lon = result.data.coord.lon;
  let lat = result.data.coord.lat;
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current&appid=${apiKey}&units=metric`;
  axios.get(forecastApiUrl).then(getForecast);
}

//Functions to transform temperature in Celsius or Faherenheit as desired
function transform(result) {
  let celciusTemp = result.data.main.temp;
  let fahrenheitTemp = (celciusTemp * 9) / 5 + 32;
  transTemp = [celciusTemp, fahrenheitTemp];
}
function transformTemp() {
  let currentCity = document.querySelector("h1").innerHTML;
  let randomCityApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}&units=metric`;
  axios.get(randomCityApiUrl).then(transform);
}

function getFahrenheitTemp(event) {
  event.preventDefault();
  document.querySelector("#current-temp").innerHTML = Math.round(transTemp[1]);
  document.querySelector("#celcius-temp").classList.remove("active");
  document.querySelector("#fahrenheit-temp").classList.add("active");
}

function getCelciusTemp(event) {
  event.preventDefault();
  document.querySelector("#current-temp").innerHTML = Math.round(transTemp[0]);
  document.querySelector("#celcius-temp").classList.add("active");
  document.querySelector("#fahrenheit-temp").classList.remove("active");
}

//Function to update city data
function updateCity(result) {
  document.querySelector("h1").innerHTML = result.data.name;
  document.querySelector(".currentTemp").innerHTML = Math.round(
    result.data.main.temp
  );
  document.querySelector("#current-humidity").innerHTML =
    result.data.main.humidity;
  document.querySelector("#current-wind").innerHTML = Math.round(
    result.data.wind.speed
  );
  document.querySelector("#city-time").innerHTML = transformTime(
    result.data.dt * 1000
  );
  document.querySelector("#weather-description").innerHTML =
    result.data.weather[0].description;
  document
    .querySelector("#current-emoji")
    .setAttribute("class", updateIcon(result.data.weather[0].id));
  //Code to format Celcius and Fahrenheit links everytime a city update happens, this makes the celcius temp displayed matches the formating of the links
  document.querySelector("#celcius-temp").classList.add("active");
  document.querySelector("#fahrenheit-temp").classList.remove("active");
  let coordinatesApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${result.data.name}&appid=${apiKey}&units=metric`;
  axios.get(coordinatesApiUrl).then(getCoordinates);
  transformTemp();
}

//Function to alert that city is not available
function errorAlert() {
  alert("🐱‍👤 Is that city located on Planet Earth? 🌍");
}

//Function to get data according city inputed by user
function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-input-form").value;
  let cityApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}&units=metric`;
  //Second function inside then only runs if get is not sucessfull
  axios.get(cityApiUrl).then(updateCity, errorAlert);
}

//Functions to get city data according current location
function coordUpdateCity(position) {
  let updatedApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(updatedApiUrl).then(updateCity);
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(coordUpdateCity);
}

// Weather Icon Library
let iconsLib = [
  {
    iconName: "800",
    class: "fas fa-sun",
  },
  {
    iconName: "8",
    class: "fas fa-cloud-sun",
  },
  {
    iconName: "3",
    class: "fas fa-cloud-rain",
  },
  {
    iconName: "5",
    class: "fas fa-cloud-showers-heavy",
  },
  {
    iconName: "2",
    class: "fas fa-bolt",
  },
  {
    iconName: "6",
    class: "far fa-snowflake",
  },
  {
    iconName: "7",
    class: "fas fa-smog",
  },
];

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

let currentHour = toAmPm();
let currentMinutes = now.getMinutes();
if (currentMinutes < 10) {
  currentMinutes = `0${currentMinutes}`;
}

let header = document.querySelector("header");
header.innerHTML = `${currentDay}, ${currentHour[0]}:${currentMinutes} ${currentHour[1]}`;

//Code to update next days according to current one
nextDays();

//Code to update data on webpage according city user input

let apiKey = "7682c2be43d876a63c355131eaac1953";
let defaultCityApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Lisbon&appid=${apiKey}&units=metric`;

axios.get(defaultCityApiUrl).then(updateCity);

// Code to get data for city according user input
let form = document.querySelector("#city-search-form");
form.addEventListener("submit", searchCity);

// Code to get data of current Location
let button = document.querySelector("button");
button.addEventListener("click", getPosition);

// Code to give current Temperature in Celcius or Fahrenheit when clicked
let transTemp = [];

document
  .querySelector("#celcius-temp")
  .addEventListener("click", getCelciusTemp);

document
  .querySelector("#fahrenheit-temp")
  .addEventListener("click", getFahrenheitTemp);
