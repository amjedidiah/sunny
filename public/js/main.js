const makeCardPulse = (input) => {
  makeCardNormal(input);
  input.parentElement.parentElement.parentElement.classList.add("active");
};

const submitForm = (form) => {
  const cityName = form.querySelector("#place").value;
  // loadData(null, cityName, true);

  if(!cityName) return inform("Please enter a city name", "danger")
  inform(`getting weather info for ${cityName}`, "success");
  getCoordinates(cityName);
};

document
  .querySelector("form#inputForm")
  .addEventListener(
    "submit",
    (e) => (e.preventDefault(), submitForm(e.target))
  );

const inform = (message, type) => {
  const n = document.createElement("div"); //Define DIV element
  const text = document.createTextNode(message); //Create text node
  n.appendChild(text); //Append text node
  document.querySelector("#body").appendChild(n); //Add it to the body

  n.classList.add("notification");

  //set type
  //intro
  n.classList.remove("shown");
  n.classList.remove("success");
  n.classList.remove("danger");
  n.classList.add(`shown`);
  n.classList.add(type);
  n.innerHTML = message;

  //outro
  setTimeout(() => {
    n.classList.remove("shown");
    n.classList.remove("success");
    n.classList.remove("danger");
  }, 3000);
};

const toggleModal = () => $(".modal").slideToggle();

const doubler = (n) => (n.toString().length > 1 ? n : `0${n}`);

const displayFullDate = () => {
  const t = new Date().getTime();
  const d = new Date(t);

  $("#userFullDate").html(d.toDateString());
};

const displayCity = (data, cityName) => {
  const timezone = (data && data.timezone) || "";
  $(".current-city").html(cityName || timezone.split("/")[1]);
};

const displayCurrent = (data) => {
  const current = data && data.current;

  if (!current)
    return inform("No weather information found for this location", "danger");

  const {
    temp,
    sunset,
    sunrise,
    dt,
    humidity,
    wind_speed,
    visibility,
    uvi,
  } = current;
  const sunS = new Date(sunset * 1000);
  const sunR = new Date(sunrise * 1000);
  const d = new Date(dt * 1000);
  const h = d.getHours();
  const m = d.getMinutes();

  const currentTemp = Math.round(temp - 273);

  $(".current-temp").html(`${currentTemp}&deg;C`);
  $(".weather-description").html(current.weather[0].description);
  $(".loading-sunrise").html(
    `${doubler(sunR.getHours())}: ${doubler(sunR.getMinutes())}`
  );
  $(".loading-sunset").html(
    `${doubler(sunS.getHours())}: ${doubler(sunS.getMinutes())}`
  );

  $("#majorTime").html(`${doubler(h)}:${doubler(m)}`);
  $(".loading.humidity").html(`${humidity}%`);
  $(".loading.wind").html(`${wind_speed}m/h`);
  $(".loading.visibility").html(`${visibility}m`);
  $(".loading.uvi").html(`${uvi}`);
  $("aside .temperature-bar .temperature-bar-indicator::before").css(
    "width",
    `${(currentTemp / 360) * 100}em !important`
  );
};

const displayHourly = (data) => {
  const hourly = (data && data.hourly) || [];

  const array = hourly.slice(0, 5);
  const hourlyDivs = [...$(".loading.hourly")];
  const hourlyTempDivs = [...$(".loading.hourly-temp")];
  const hourlyCloudDivs = [...$(".loading.hourly-cloudiness")];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const t = item && item.dt;
    const d = new Date(t * 1000);
    const h = d.getHours();
    const T = Math.round((item && item.temp) - 273);

    hourlyDivs[i].innerHTML = `${doubler(h)}:00`;

    hourlyTempDivs[i].innerHTML = `${T}&deg;`;
    hourlyCloudDivs[i].innerHTML = `${item && item.clouds}%`;
  }
};

const displayDaily = (data) => {
  const daily = (data && data.daily) || [];

  const array = daily.slice(0, 3);
  const dailyCloudDivs = [...$(".loading.daily-cloud")];
  const dailyTempDivs = [...$(".loading.daily-temp")];
  const dailyRainDivs = [...$(".loading.daily-rain")];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];

    $(dailyCloudDivs[i]).html(() => {
      let fa = null;

      if (item.rain > 0.5 && item.rain < 4)
        return `<i class="fas fa-cloud-rain"></i>`;
      if (item.rain >= 4) return `<i class="fas fa-cloud-showers-heavy"></i>`;

      return `<i class="fas fa-cloud"></i>`;
    });

    $(dailyTempDivs[i]).html(
      `${Math.round(item.temp.min - 273)}&deg; - ${Math.round(
        item.temp.max - 273
      )}&deg;`
    );
    $(dailyRainDivs[i]).html(Math.round(item.rain || 0));
  }
};

const getCoordinates = (cityName) =>
  !navigator.geolocation
    ? loadData(null, cityName, true)
    : navigator.geolocation.getCurrentPosition(
        (position) =>
          loadData(
            {
              latt: position.coords.latitude,
              longt: position.coords.longitude,
            },
            cityName,
            true
          ),
        () => loadData(null, cityName, true)
      );

const savedCities = () => {
  const localSunny = JSON.parse(localStorage.getItem("sunny_d")) || [];

  if (localSunny.length > 0) {
    $(".saved-cities-container").show();
    $(".no-cities").hide();

    const data = localSunny.map(
      (
        { cityName, data },
        i
      ) => `<div class="city pointer" data-cityName="${cityName}" data-count="${i}">
    <div>
      <h3 class="name">${cityName}</h3>
    </div>
    <div>
      <p class="display-4">${Math.round(data.current.temp - 273)}&deg;C</p>
      <p><i class="fas fa-cloud"></i> ${data.current.clouds}%</p>
    </div>
  </div>`
    );

    $(".saved-cities-container").html(data);

    const savedCities = [...document.querySelectorAll(".city")];

    for (let i = 0; i < savedCities.length; i++) {
      const element = savedCities[i];

      element.addEventListener(
        "click",
        (e) => (
          e.preventDefault(),
          loadData(
            null,
            e.target.getAttribute("data-cityName"),
            null,
            localSunny[Number(e.target.getAttribute("data-count"))].data
          )
        )
      );
    }
  } else {
    $(".saved-cities-container").hide();
    $(".no-cities").show();
  }
};

const loadData = async (coordinates, cityName, isSubmitted, dat) => {
  try {
    displayFullDate();

    let longt, latt, data;
    const city = isSubmitted ? cityName : "Lagos";

    if (cityName && !dat) {
      // const geo = await fetch(
      //   `https://geocode.xyz/${city}?json=1&auth=848427855429474377519x125986`
      // );
      // const geoData = await geo.json();
      // latt = geoData && geoData.latt;
      // longt = geoData && geoData.longt;

      const geo = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCzKooz5xemm7uiiHi01ZB3S9LDe4inYHE`
      );
      const geoData = await geo.json();
      latt = geoData.results[0].geometry.location.lat;
      longt = geoData.results[0].geometry.location.lng;
    } else if (coordinates) {
      longt = coordinates.longt;
      latt = coordinates.latt;

      cityName = cityName ? cityName : "your current position";
    } else {
      latt = 6.45506;
      longt = 3.39418;

      cityName = cityName ? cityName : "Lagos";
    }

    if (!latt)
      return inform(
        "Unable to get weather for this location now. Try again",
        "danger"
      );

    if (!dat) {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${longt}&exclude=minutely&appid=e7e80a2086b6308579f329f5eabc8869`
      );
      data = await res.json();
    } else {
      data = dat;
    }

    // Check if already exists
    const localSunny = JSON.parse(localStorage.getItem("sunny_d")) || [];

    const duplicateData = localSunny.filter(
      (item) =>
        (data.lon === item.data.lon && data.lat === item.data.lat) ||
        item.cityName === cityName
    );

    if (duplicateData < 1) {
      localStorage.setItem(
        "sunny_d",
        JSON.stringify([...localSunny, { cityName, data }])
      );
    }

    displayCity(data, cityName);
    displayCurrent(data);
    displayHourly(data);
    displayDaily(data);
    if (!dat) toggleModal();
    savedCities();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    inform(`Fetched temperature info for ${cityName}`, "success");
  } catch (error) {
    inform(error && error.message, "danger");
  }
};

const showForm = () => {
  toggleModal();

  $(".modal-child").removeClass("d-none");
  $(".modal-child.loader").addClass("d-none");
};

(function getCoords() {
  return new Promise((resolve, reject) =>
    navigator.permissions
      ? // Permission API is implemented
        navigator.permissions
          .query({
            name: "geolocation",
          })
          .then((permission) =>
            // is geolocation granted?
            permission.state === "granted" ? getCoordinates() : loadData()
          )
      : // Permission API was not implemented
        reject(new Error("Permission API is not supported"))
  );
})()
