
function readcitiesFromStorage() {
    let cities= JSON.parse(localStorage.getItem('cities'));

    if (!cities) {
      cities = [];
    }
    return cities;
  };
document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('submit_button').addEventListener('click', submit);

    function submit(event) {
        event.preventDefault();
        const searchTerm = document.getElementById('search_input').value;
        const cityNameSearch = searchTerm;
        let cities = readcitiesFromStorage();

        // Add the new city to the array
        cities.push(cityNameSearch);

        // Update local storage with the updated array of cities
        localStorage.setItem('cities', JSON.stringify(cities));
        const apiWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameSearch},us&appid=66fe021ba36c4924687e75cb0e602542`;
        
        fetch(apiWeather)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                const locationLat = data.coord.lat;
                const locationLon = data.coord.lon;

                const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${locationLat}&lon=${locationLon}&appid=66fe021ba36c4924687e75cb0e602542`;

                fetch(apiUrlForecast)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        console.log(data);
                        const todayWeather = data.list[0].weather[0].icon;
                        const todayWeatherIcon = document.createElement('img');
                        todayWeatherIcon.src = `https://openweathermap.org/img/w/${todayWeather}.png`;

                        const todayWeatherDiv = document.getElementById('today_weather');
                        todayWeatherDiv.appendChild(todayWeatherIcon);

                        const cityName = data.city.name;
                        const cityNameText = document.createTextNode(cityName);

                        const cityNameDiv = document.getElementById('city_name');
                        cityNameDiv.appendChild(cityNameText);

                        const date = new Date(data.list[0].dt * 1000);
                        const dateText = document.createTextNode(date.toDateString());

                        const dateDiv = document.getElementById('date');
                        dateDiv.appendChild(dateText);

                        const temperatureKelvin = data.list[0].main.temp;
                        const temperatureFahrenheit = (temperatureKelvin - 273.15) * 1.8 + 32;
                        const windSpeed = data.list[0].wind.speed;
                        const humidity = data.list[0].main.humidity;

                        const weatherDetailsDiv = document.getElementById('weather_details');
                        const detailsText = document.createTextNode(`Temperature: ${temperatureFahrenheit.toFixed(2)} °F | Wind Speed: ${windSpeed} m/s | Humidity: ${humidity}%`);
                        weatherDetailsDiv.appendChild(detailsText);
                    })
                    .catch(function(error) {
                        console.log('Error fetching forecast data:', error);
                    });
            })
            .catch(function(error) {
                console.log('Error fetching weather data:', error);
            });
    }
});