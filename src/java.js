// Weather Icon Library
let iconsLib = [
  {
    iconName: "clear sky",
    class: "fas fa-sun",
  },
  {
    iconName: "few clouds",
    class: "fas fa-cloud-sun",
  },
  {
    iconName: "scattered clouds",
    class: "fas fa-cloud",
  },
  {
    iconName: "broken clouds",
    class: "fas fa-cloud",
  },
  {
    iconName: "shower rain",
    class: "fas fa-cloud-rain",
  },
  {
    iconName: "light rain",
    class: "fas fa-cloud-sun-rain",
  },
  {
    iconName: "rain",
    class: "fas fa-cloud-showers-heavy",
  },
  {
    iconName: "	thunderstorm",
    class: "fas fa-bolt",
  },
  {
    iconName: "snow",
    class: "far fa-snowflake",
  },
  {
    iconName: "mist",
    class: "fas fa-smog",
  },
];

function updateIcon(description) {
  for (i = 0; i < 10; i++) {
    if (iconsLib[i].iconName == description) {
      console.log(iconsLib[i].class);
      let newClass = `${iconsLib[i].class}`;
      console.log(newClass);
      return newClass;
    }
  }
}

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

//Code to update next days according to current one
function nextDays() {
  for (let i = 1; i < 6; i++) {
    let nextDayIndex = now.getDay() + i;
    if (nextDayIndex > 6) {
      nextDayIndex = now.getDay() + i - 7;
    }
    let nextDay = days[nextDayIndex];
    console.log(nextDayIndex);
    document.querySelector(`#day-${i}`).innerHTML = `${nextDay}`;
  }
}

nextDays();
// Code to give current Temperature in Celcius or Fahrenheit when clicked
function getCelciusTemp() {
  event.preventDefault();
  let h2 = document.querySelector(".currentTemp");
  h2.innerHTML = "17";
}

let showCelcius = document.querySelector("#celcius-temp");
showCelcius.addEventListener("click", getCelciusTemp);

function getFahrenheitTemp() {
  event.preventDefault();
  let h2 = document.querySelector(".currentTemp");
  h2.innerHTML = "63";
}

let showFahrenheit = document.querySelector("#fahrenheit-temp");
showFahrenheit.addEventListener("click", getFahrenheitTemp);

//Code to update data on webpage according city user input
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
    .setAttribute("class", updateIcon(result.data.weather[0].description));
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
