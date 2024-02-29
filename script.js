const API_key = "618758dd1efc119b4c2dda4aa5b3e9fe"
let city_name = "London";
const currTemp = document.getElementById("currtemp");
const minTemp = document.getElementById("minTemp");
const maxTemp = document.getElementById("maxTemp");
const imgIcon = document.getElementById("imgIcon");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humdity");
const feelsLike = document.getElementById("reelFeel");
const uvIndex = document.getElementById("uvIndex");
const sunRise = document.getElementById("sunRise");
const sunSet = document.getElementById("sunSet");
const speedWind = document.getElementById("speed")
const directionWind = document.getElementById("direction")
const imageIc = document.getElementById("imgIcon");
const description = document.getElementById("desciption")
const readText = document.getElementById("searchId")
const getText = document.getElementById("searchButton")
const countryName = document.getElementById("countryName");
const countryNames = {};

getText.addEventListener(("click"), ()=>{
    check_weather(readText.value)
})

function handleKeyPress(event) {
  if (event.key === "Enter") {
      check_weather(readText.value)
  }
}

async function getCountryNames() {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const countries = await response.json();
  countries.forEach(country => {
    const alpha2Code = country.cca2;
    const fullName = country.name.common;
    countryNames[alpha2Code] = fullName;
  });
  return countryNames;
}

async function fetchData(apiUrl){
  try {
    const response = await fetch(apiUrl)
       
        if (!response.ok) {
          // throw new Error('Network response was not ok');
           alert("wrong city name");
        }
        
        const data = await response.json()
        return data
      } 
      catch (error) {
        error('Error fetching data:', error)
        throw error
      }
      
    }
    
    let data = [];
    let temp;
    let min_temp;
    let max_temp;
    let pressureVar;
    let humidityVar;
    let feelsLikeVar;
    let timeRiseVar;
    let timeSetVar;
    let hrTimeSet;
    let minTimeSet;
    let secTimeSet;
    let hrTimeRise;
    let minTimeRise;
    let secTimeRise;
    let direction;
    let speed;
    let ico;
    let desrc;
    let country;
    let countryFullName;
    
    
function intoCelcius(temperature){
   
   return Math.floor(temperature-273) ;
}

function getDirection(degrees) {
  // Ensure degrees are within the range [0, 360)
  degrees = (degrees % 360 + 360) % 360;

  if (degrees >= 337.5 || degrees < 22.5) {
    return "North";
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return "North-East";
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return "East";
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return "South-east";
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return "South";
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return "South-West";
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return "West";
  } else {
    return "North-West";
  }
}

function intoSecAndMinSet(time){
  let timeinSec = time/1000;
  secTimeSet = formating(Math.floor(timeinSec % 60));
  minTimeSet = formating(Math.floor((timeinSec / 60) % 60));
  hrTimeSet= formating(Math.floor((timeinSec / 3600) % 12));
}
function intoSecAndMinRise(time){
  let timeinSec = time/1000;
  secTimeRise = formating(Math.floor(timeinSec % 60));
  minTimeRise = formating(Math.floor((timeinSec / 60) % 60));
  hrTimeRise = formating(Math.floor((timeinSec / 3600) % 24));
}

function formating(time){
  return time < '10' ? `0${time}` : time;
}

 async function check_weather(city_name){
    data = await fetchData( `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=e50bb76f78c4c379f3fe61e641e4cc5f`);
  
    console.log(data)
    temp = data.main.temp;
    currTemp.innerHTML = `<h1>${intoCelcius(temp)} <span>&#176;</span>C</h1>`;
    
    min_temp = data.main.temp_min;
    minTemp.innerHTML = `<h1> Min : <span> ${intoCelcius(min_temp)} <span>&#176;</span>C</span> </h1>`
    max_temp = data.main.temp_max;
    maxTemp.innerHTML = `<h1> Max : <span> ${intoCelcius(max_temp)} <span>&#176;</span>C</span> </h1>`
    
    pressureVar = data.main.pressure
    pressure.innerText = `Pressure : ${pressureVar}mbar`
    humidityVar = data.main.humidity
    humidity.innerText = `Humidity : ${humidityVar} % `
    feelsLikeVar = data.main.feels_like
    feelsLike.innerHTML = `<h1>Real Feel : ${intoCelcius(feelsLikeVar)}<span>&#176;</span>C</h1>`

    timeRiseVar = data.sys.sunrise;
    intoSecAndMinSet(timeRiseVar);
    sunRise.innerText = `Sunrise ~ ${hrTimeSet}:${minTimeSet} A.M.`;

    timeSetVar = data.sys.sunset;
    intoSecAndMinRise(timeSetVar);
    sunSet.innerText = `Sunset ~ ${hrTimeRise}:${minTimeRise} P.M.`;

    direction = data.wind.deg;
    directionWind.innerText = `Direction : ${getDirection(direction)}`
    speed = data.wind.speed;
    speedWind.innerText = `Speed : ${speed}km/h`

    ico = data.weather[0].icon;
    imageIc.classList.remove("opacity-0");
    imageIc.classList.add("opacity-100");
    imageIc.src = `https://openweathermap.org/img/wn/${ico}@2x.png`;
    
    desrc = data.weather[0].main
    description.innerText = `${desrc.toUpperCase()} in ${city_name}`

    getCountryNames().then(countryNames => {
      country = data.sys.country;
      countryFullName = countryNames[country]
      countryName.innerText = `${countryFullName.toUpperCase()}`
      
    });
    
}



