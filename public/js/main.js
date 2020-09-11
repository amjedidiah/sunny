const makeCardPulse = (input) => {
  makeCardNormal(input);
  input.parentElement.parentElement.parentElement.classList.add("active");
};

const submitForm = (form) => {
  const cityName = form.querySelector("#place").value
  console.log(form);
  loadData(cityName, true)
};

document
  .querySelector("form#inputForm")
  .addEventListener(
    "submit",
    (e) => (e.preventDefault(), submitForm(e.target))
  );

const toggleModal = () => $(".modal").slideToggle();

const doubler = (n) => (n.toString().length > 1 ? n : `0${n}`);

const displayFullDate = () => {
  const t = new Date().getTime();
  const d = new Date(t);

  $("#userFullDate").html(d.toDateString());
};

const displayCity = (data) => {
  const timezone = (data && data.timezone) || "";
  $(".current-city").html(timezone.split("/")[1]);
};

const displayCurrent = (data) => {
  const current = data && data.current;
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

const loadData = async (cityName, isSubmitted) => {
  try {
    displayFullDate();
    const city = isSubmitted ? cityName : "Lagos";
    const geo = await fetch(
      `https://geocode.xyz/${city}?json=1&auth=848427855429474377519x125986`
    );
    const geoData = await geo.json();
    const latt = (geoData && geoData.latt) || 6.45506;
    const longt = (geoData && geoData.longt) || 3.39418;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${longt}&exclude=minutely&appid=e7e80a2086b6308579f329f5eabc8869`
    );
    const data = await res.json();

    console.log(data);

    displayCity(data);
    displayCurrent(data);
    displayHourly(data);
    displayDaily(data);
    toggleModal();
  } catch (error) {
    alert(error && error.message);
  }
};

const showForm = () => {
  toggleModal();

  $(".modal-child").toggleClass("d-none");
};

loadData();
