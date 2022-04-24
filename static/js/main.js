// pour les API keys
import { myKeys } from "./config.js";
// pour les fonctions accessoires et les data
import * as Util from "./utils.js";
import * as Data from "./data.js";

const openCageApiKey = myKeys.cageApiKey;
const openWeatherApiKey = myKeys.weatherApiKey;

// pour les base_url
const openCageApi = "https://api.opencagedata.com/geocode/v1/json?";
const openWeatherApi = "https://api.openweathermap.org/data/2.5/onecall?";
// pour les options openweather
const openWeatherExclude = "alerts,minutely,hourly";

let cityLat;
let cityLong;
let weatherId;
let weatherMain;
let weatherTemp;
let weatherTempMinMax;
let timeStamp;
let selectedNumber;
let weatherIcon;

// pour nettoyer
function cleanUp() {
  let showNodeWCont = document.getElementById("weather-container");
  if (showNodeWCont.classList.contains("to-hide")) {
    showNodeWCont.classList.toggle("to-hide");
  }

  let class2remove = showNodeWCont.className;
  if (class2remove) {
    showNodeWCont.classList.remove(class2remove);
  }

  if (showNodeWCont.hasChildNodes()) {
    while (showNodeWCont.firstChild) {
      showNodeWCont.removeChild(showNodeWCont.firstChild);
    }
  }
}

// pour savoir si nuit ou jour pour affichage bkgd
function getNightOrDay(timeStamp, timeSunSet, timeSunRise) {
  try {
    const sunSet = new Date(timeSunSet * 1000);
    const sunRise = new Date(timeSunRise * 1000);
    const now = new Date(timeStamp * 1000);
    let nowTime = parseFloat(now.getUTCHours() + now.getUTCMinutes() * 0.01);
    let nowRise = parseFloat(
      sunRise.getUTCHours() + sunRise.getUTCMinutes() * 0.01
    );
    let nowSet = parseFloat(
      sunSet.getUTCHours() + sunSet.getUTCMinutes() * 0.01
    );
    (nowTime >= 0 && nowTime < nowRise) || nowTime >= nowSet
      ? (document.querySelector("body").style.background =
          "linear-gradient(to bottom, #000000, #082e4e)")
      : (document.querySelector("body").style.background =
          "linear-gradient(to top, #004683, #881da8)");
  } catch (e) {
    console.error(e);
  }
}

// pour calculer le jour/date
function getTheDay(timeStamp) {
  try {
    const myDate = new Date(timeStamp * 1000);
    const day = Data.days[myDate.getUTCDay()];
    const nDay = myDate.getUTCDate();
    const month = Data.months[myDate.getMonth()];
    const monthNum = myDate.getMonth() + 1;
    return [day, nDay, month, monthNum];
  } catch (e) {
    console.error(e);
  }
}

function getTheTime(timeStamp) {
  let myTime = new Date(timeStamp * 1000);
  function addLeadingZeros(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n;
  }
  let formattedTime =
    myTime.getUTCHours() +
    ":" +
    (myTime.getUTCMinutes() <= 9
      ? "0" + myTime.getUTCMinutes()
      : myTime.getUTCMinutes()) +
    (myTime.getUTCHours() < 12 ? "am" : "pm");
  console.log(formattedTime);
  return formattedTime;
}

function createTimeSpan(timeStamp) {
  let spanItem = document.createElement("span");
  let time = getTheTime(timeStamp);
  spanItem.innerHTML = "</br>" + time + " local time";
  document.getElementById("city-formatted").appendChild(spanItem);
}

// pour creer div container infos
function createDivItem(
  timeStamp,
  weatherTemp,
  weatherTempMinMax,
  metrics,
  selectedNumber
) {
  try {
    let metric;
    metrics === "celsius" ? (metric = "&#8451;") : (metric = "&#8457;");
    let res = getTheDay(timeStamp);

    let divItem = document.createElement("div");
    divItem.classList.add("weather-item");

    let divTxt = document.createElement("div");
    divTxt.classList.add("weather-text", "heading-secondary");
    divTxt.innerHTML = res[0] + "</br>" + res[1] + " " + res[2];
    divItem.setAttribute("id", res[0].toLowerCase());
    divItem.appendChild(divTxt);

    let divDicton = document.createElement("div");
    divDicton.classList.add("weather-dicton", "heading-tertiary");
    divDicton.innerHTML = Data.dictons[res[3]][res[1] - 1];
    divItem.appendChild(divDicton);

    let divTemp = document.createElement("div");
    divTemp.classList.add("weather-temp", "heading-secondary");
    divTemp.innerHTML = weatherTemp + metric;
    divItem.appendChild(divTemp);

    let divTempMinMax = document.createElement("div");
    divTempMinMax.classList.add("weather-temp-min-max", "heading-tertiary");
    divTempMinMax.innerHTML = weatherTempMinMax;
    divItem.appendChild(divTempMinMax);

    // pour affichage flex/grid
    let display = "";
    if (selectedNumber > 4) {
      display = "display-grid-" + selectedNumber;
    } else {
      display = "display-flex";
    }
    document.getElementById("weather-container").classList.add(display);
    document.getElementById("weather-container").appendChild(divItem);
  } catch (e) {
    console.error(e);
  }
}

// pour ajouter attributs src et alt a icone creee
function setImgSrcAlt(dict) {
  weatherIcon.setAttribute(dict[0][0], dict[0][1]);
  weatherIcon.setAttribute(dict[1][0], dict[1][1]);
}

// pour creer icone
function createImage(weatherId, weatherMain) {
  try {
    // creation et selection image
    let divBox = document.createElement("div");
    divBox.classList.add("weather-img-box");
    weatherIcon = document.createElement("img");
    weatherIcon.classList.add("weather-img");
    if (weatherMain === "Snow") {
      setImgSrcAlt(Data.weatherIcons.Snow);
    } else if (weatherMain === "Clear") {
      setImgSrcAlt(Data.weatherIcons.Clear);
    } else if (weatherMain === "Clouds") {
      if (weatherId === 801 || weatherId === 802) {
        setImgSrcAlt(Data.weatherIcons.Cloudy);
      } else {
        setImgSrcAlt(Data.weatherIcons.Clouds);
      }
    } else {
      setImgSrcAlt(Data.weatherIcons.Else);
    }
    divBox.appendChild(weatherIcon);
    let day = getTheDay(timeStamp)[0].toLowerCase();
    document.getElementById(day).appendChild(divBox);
  } catch (e) {
    console.error(e);
  }
}

// pour recuperer data et lancer creation weather-item
function createWeatherItems(data, metrics) {
  try {
    let offset = data.timezone_offset;
    let timeSunSet = data.current.sunset + offset;
    let timeSunRise = data.current.sunrise + offset;
    function cleanZero(num) {
      num = num.toFixed(0);
      if (num.startsWith("-0")) {
        return num[1];
      } else return num;
    }
    weatherId = data.current.weather[0].id;
    weatherMain = data.current.weather[0].main;
    weatherTemp = cleanZero(data.current.temp);
    weatherTempMinMax =
      cleanZero(data.daily[0].temp.min) +
      "° / " +
      cleanZero(data.daily[0].temp.max) +
      "°";
    timeStamp = data.current.dt + offset;
    getNightOrDay(timeStamp, timeSunSet, timeSunRise);
    getTheTime(timeStamp);
    createTimeSpan(timeStamp);
    createDivItem(
      timeStamp,
      weatherTemp,
      weatherTempMinMax,
      metrics,
      selectedNumber
    );
    createImage(weatherId, weatherMain);

    if (selectedNumber > 1) {
      for (let i = 1; i < selectedNumber; i++) {
        weatherId = data.daily[i].weather[0].id;
        weatherMain = data.daily[i].weather[0].main;
        weatherTemp = cleanZero(data.daily[i].temp.day);
        weatherTempMinMax =
          cleanZero(data.daily[i].temp.min) +
          "° / " +
          cleanZero(data.daily[i].temp.max) +
          "°";
        timeStamp = data.daily[i].dt + offset;

        createDivItem(
          timeStamp,
          weatherTemp,
          weatherTempMinMax,
          metrics,
          selectedNumber
        );
        createImage(weatherId, weatherMain);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

// récupère lat et lng par res de l'api openCage
function getLatLng(data) {
  try {
    document.getElementById("city-formatted").textContent = data[0].formatted;
    cityLat = data[0].geometry.lat;
    cityLong = data[0].geometry.lng;
    if (cityLat && cityLong) {
      return;
    } else console.error("Pb with cityLat or cityLong!!");
  } catch (e) {
    console.error(e);
  }
}

// async / await = asynchrone synchrone
// rendre synchrone la resolution des PROMESSES
// g a AWAIT

async function main(city, metrics) {
  await fetch(`${openCageApi}key=${openCageApiKey}&q=${city}&language=en`)
    .then(function (result) {
      if (result.ok) {
        return result.json();
      }
    })
    .then((json) => json.results)
    .then((results) => {
      getLatLng(results);
    })
    .catch(function () {
      document.getElementById("missing-error-message").textContent =
        "Can't find that city, sorry!";
      document.getElementById("city-formatted").textContent = "";
      document.getElementById("city-formatted").firstChild.textContent = "";
      document.getElementById("weather-container").classList.add("to-hide");
    });

  let metricApi = "";
  if (metrics === "celsius") {
    metricApi = "&units=metric";
  }

  let meteo = await fetch(
    `${openWeatherApi}lat=${cityLat}&lon=${cityLong}&exclude=${openWeatherExclude}&appid=${openWeatherApiKey}${metricApi}`
  )
    .then(function (result) {
      if (result.ok) {
        return result.json();
      }
    })
    .then((json) => json)
    .catch(function (err) {
      console.error(err);
    });

  createWeatherItems(meteo, metrics);
}

// action si click sur bouton Go
// avec jQuery
// $(document).ready(function () {
// ou
// $(function () {
if (document.getElementById("btn-weather")) {
  let loader = setInterval(function () {
    if (document.readyState !== "complete") return;
    clearInterval(loader);
    // avec jQuery
    // $("button").click(function (e) {

    document
      .getElementById("btn-weather")
      .addEventListener("click", function (e) {
        e.preventDefault();
        cleanUp();
        let city = document.getElementById("city-name-input").value;
        if (city) {
          document.getElementById("missing-error-message").textContent = "";
          let selectElmt = document.getElementById("week-days");
          selectedNumber = selectElmt.options[selectElmt.selectedIndex].value;
          let radio = document.getElementsByName("radio");
          let metrics = "";
          for (let i = 0; i < radio.length; i++) {
            if (radio[i].checked) {
              metrics = radio[i].value;
            }
          }
          main(city, metrics);
        } else {
          document.getElementById("missing-error-message").textContent =
            "Need a name!";
          document.getElementById("city-formatted").textContent = "";
        }
        document.getElementById("form-city").reset();
      });

    // }); jq
  }, 300);
}
// utilitaires
Util.setScrolling();
Util.setCopyright();
Util.checkFlexGap();
