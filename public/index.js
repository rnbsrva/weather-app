document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    document.getElementById("akerke").hidden = true;
  });
  
  const findCityWeather = (event) => {
    document.getElementById("akerke").hidden = false;
  
    event.preventDefault();
    const city = document.getElementById("cityInput").value;
    fetchCity(event);
    const accessKey = "6Kh1mRFC4UlngLvhCCvHGZN1erj1kmD5URuelcbQN7c";
    const photoContainer = document.getElementById("photo-container");
  
    fetch(
      `https://api.unsplash.com/photos/random?query=${city}&client_id=${accessKey}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const photoUrl = data.urls.regular;
        const photoElement = `<img src="${photoUrl}" alt="City Photo" class="img-fluid">`;
        photoContainer.innerHTML = photoElement;
      })
      .catch((error) => {
        console.error("Error fetching photo from Unsplash:", error);
      });
    fetch(`/weather?city=${city}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        displayWeatherData(data);
        document.getElementById("weatherCard").hidden = false;
        
      })
      .catch((err) => alert(err));
  };
  
  const displayWeatherData = (data) => {
    const iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    document.getElementById("weatherIcon").src = iconUrl;
  
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = data.main.temp;
    document.getElementById("weatherDescription").textContent =
      data.weather[0].description;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("windSpeed").textContent = data.wind.speed;
    document.getElementById("max_temperature").textContent = data.main.temp_max;
    document.getElementById("min_temperature").textContent = data.main.temp_min;
    document.getElementById("feels_like_temperature").textContent =
      data.main.feels_like;
    document.getElementById("country_code").textContent = data.main.temp_min;
    document.getElementById(
      "coordinates"
    ).textContent = `lon:${data.coord.lon}, lat:${data.coord.lat}`;
    initMap(data.coord.lat, data.coord.lon);
    document.getElementById("country_code").textContent = data.cod;
  };
  
  document.addEventListener("DOMContentLoaded", (event) => {
    event.preventDefault();
  
    document.getElementById("defaultOpen").click();
    document.getElementById("weatherCard").hidden = true;
    document.getElementById("jokesCard").hidden = true;
    document.getElementById("postsContainer").hidden = true;
  });
  
  const fetchCity = (event) => {
    event.preventDefault();
  
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value;
  
    fetch(`/cities?city=${city}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        displayResult(data);
      })
      .catch((err) => alert(err));
  };
  
  async function getPopulation() {
    const cityInput = document.getElementById("cityInput").value;
    const apiUrl =
      "https://countriesnow.space/api/v0.1/countries/population/cities";
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityInput }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      displayResult(data);
    } catch (error) {
      console.error("Error:", error.message);
      displayResult({ error: "An error occurred while fetching data." });
    }
  }
  
  function displayResult(data) {
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = "";
  
    if (data.error === false) {
      const populationData = data.data.populationCounts[0];
  
      resultContainer.innerHTML = `<p>${data.msg}</p>
                                      <p>City: ${data.data.city}</p>
                                      <p>Country: ${data.data.country}</p>
                                      <p>Population in ${populationData.year}: ${populationData.value}</p>
                                      <p>Reliability: ${populationData.reliabilty}</p>`;
    } else {
      resultContainer.innerHTML = `<p>${data.msg}</p>`;
    }
  }
  

  function initMap(latitude, longitude) {
    var mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 12
  };

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: 'City Location'
  });
}