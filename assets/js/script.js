//function to call weather API
var parkDisplay = document.querySelector("#meet-display");
var weatherDisplay = document.querySelector("#weather-display");


function myFunction() {
  var searchTerm = document.querySelector("#searchTerm").value.split(", ");
  event.preventDefault();

  // Make a `fetch` request concatenating that search term to the query URL for weather forecast
  fetch(
    'https://api.openweathermap.org/data/2.5/forecast?q=' + searchTerm[0] + '&units=imperial&appid=8e2a4447de15a5d804cf8a7d25a93eca'
  )

    // Converts the response to JSON
    .then(function (response) {
      return response.json();
    })

    .then(function (response) {
      var cityLat = response.city.coord.lat;
      var cityLong = response.city.coord.lon;
      var datesArray = []
      weatherDisplay.innerHTML = "<h2" + " class = 'weather-title'" + ">" + "5 Day forecast:" + "</h2>" + "<br>";

      /* use jQuery to bring weather data from the API to the 5-day forecast cards */
      for (let day = 1; day <= 5; day++) {
        var date = moment().add(day, "days").format("M/D/YYYY").toString()
        datesArray.push(date);
      }

      for (let index = 4; index <= 36; index += 8) {
        var dateEl = document.createElement("p");
        var tempEl = document.createElement("p");
        var windEl = document.createElement("p");
        var HumidityEl = document.createElement("p");
        var iconEl = document.createElement("img");


        dateEl.className = "weather-item";
        tempEl.className = "weather-item";
        windEl.className = "weather-item";
        HumidityEl.className = "weather-item";


        dateEl.textContent = datesArray[(index - 4) / 8];
        tempEl.textContent = "Temp: " + response.list[index].main.temp + " °F";
        windEl.textContent = "Wind: " + response.list[index].wind.speed + " mph";
        HumidityEl.textContent = "Humidity: " + response.list[index].main.humidity + "%";
        iconEl.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[index].weather[0].icon + ".png");

        weatherDisplay.appendChild(dateEl);
        weatherDisplay.appendChild(tempEl);
        weatherDisplay.appendChild(windEl);
        weatherDisplay.appendChild(HumidityEl);
        weatherDisplay.appendChild(iconEl);
      }

      // function to call trail API

      // Make a `fetch` request concatenating that search term to the query URL for nearby parks
      fetch(
        'https://developer.nps.gov/api/v1/parks?stateCode=' + searchTerm[1] + '&limit=100&api_key=eIBcWOJxSuc0Pbly72GNBY8PLO1RTfczXbAeb5hL'
      )

        // Converts the response to JSON
        .then(function (response) {
          return response.json();
        })

        .then(function (response) {

          var totalDisplayed = 0;
          parkDisplay.innerHTML = "<h2" + " class = 'park-list'" + ">" + "Park List:" + "</h2>" + "<br>";

          // See how many parks displayed with a max distance of 1 degree. 
          // The call to function displayParks takes the entire response,
          // city coordinates, and specified max distance
          totalDisplayed = displayParks(response, cityLat, cityLong, 1)
          // If none are displayed, expand the max distance to 2 degrees. If still
          // nothing returns, then display message of no nearby parks.
          if ((totalDisplayed === 0)) {
            totalDisplayed = displayParks(response, cityLat, cityLong, 2)
            if ((totalDisplayed === 0)) {
              parkDisplay.innerHTML = "<h2>" + "No nearby parks. Try another location." + "</h2>";
            }
          }

        });
    });
};

// This function accepts the coordinates of the city entered, plus
// the ones from the park element which is currently being processed 
// from the response array. It returns the distance in miles.
function convertCoordinates(lat1, lat2, long1, long2) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = long1 - long2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  }
}

function displayParks(response, cityLat, cityLong, maxDist) {
  var total = 0;

  for (let i = 0; i < response.data.length; i++) {
    var parkLat = response.data[i].latitude
    var parkLong = response.data[i].longitude
    var latDiff = Math.abs(cityLat - parkLat);
    var longDiff = Math.abs(cityLong - parkLong);

    if ((latDiff < maxDist) && (longDiff < maxDist)) {
      var parkName = document.createElement("p");
      var url = document.createElement("p");
      var description = document.createElement("p");
      var image = document.createElement("img");
      var distanceText = document.createElement("p");
      var lineBreak = document.createElement("br");
      var distanceNumber; 

      parkName.className = "park-item parkName";
      url.className = "park-item description";
      description.className = "park-item description";
      image.className = "park-item park-img";
      distanceText.className = "park-item description";

      
      parkName.textContent = "Name: " + response.data[i].fullName;
      url.textContent = "Link: " + response.data[i].url;
      description.textContent = "Description: " + response.data[i].description;
      image.setAttribute('src', response.data[i].images[0].url);

      distanceNumber = convertCoordinates(cityLat, parkLat, cityLong, parkLong);
      distanceNumber = distanceNumber.toFixed(1);
      distanceText.textContent = "Distance: " + distanceNumber + " miles."

      parkDisplay.appendChild(parkName);
      parkDisplay.appendChild(url);
      parkDisplay.appendChild(distanceText);
      parkDisplay.appendChild(description);
      parkDisplay.appendChild(image);
      parkDisplay.appendChild(lineBreak);
      total++;
    }
  }
  return total;
}