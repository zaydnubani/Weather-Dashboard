var APIkey = "8b14d19031fab4d6e7d75ee8d81457f6"
var city;

var searchCity = document.querySelector(".searchCity");

var cityVal = document.querySelector(".city");

function removeDailyForecast() {
    var dailyForecast = document.querySelector(".dailyForecast");
    dailyForecast.remove();
};

function addDailyForecast() {
    var todayForecast = document.querySelector('.todayForecast');
    var div = document.createElement("div");
    div.setAttribute("class", "dailyForecast row");
    todayForecast.appendChild(div);
};

function saveCity(){
    var cities = JSON.parse(localStorage.getItem("cities"));
    if(cities == null) cities = [];
    var cityVal = document.querySelector(".city").value;
    var entry = {"cityName": cityVal};
    localStorage.setItem("entry", JSON.stringify(entry));
    // Save allEntries back to local storage
    cities.push(entry);
    localStorage.setItem("cities", JSON.stringify(cities));
};

function saveCityButton() {
    var storedCities = JSON.parse(localStorage.cities);
    for (var i = 0; i < storedCities.length; i++){
        var savedCity = document.querySelector(".savedCity");
        var save = document.createElement("button");
        save.setAttribute("class", "cityButton btn btn-outline-secondary w-75 m-1 " + storedCities[i].cityName);
        save.setAttribute("data-value", storedCities[i].cityName);
        save.textContent = storedCities[i].cityName;
        savedCity.appendChild(save);
        var cityClass = document.querySelector("."+storedCities[i].cityName);
        cityClass.addEventListener('click', function(event){
            console.log(event.target.dataset.value);
                removeDailyForecast();
                getCurrentWeather(event.target.dataset.value);
                addDailyForecast();
        });
    };
};

function addCityButton() {
    var savedCity = document.querySelector(".savedCity");
    var save = document.createElement("button");
    save.setAttribute("class", "cityButton btn btn-outline-secondary w-75 m-1 " + cityVal.value);
    save.setAttribute("data-value", cityVal.value);
    save.textContent = cityVal.value;
    savedCity.appendChild(save);
    var cityClass = document.querySelector("."+cityVal.value);
        cityClass.addEventListener('click', function(event){
            console.log(event.target.dataset.value);
            removeDailyForecast();
            getCurrentWeather(event.target.dataset.value);
            addDailyForecast();
        });
};

searchCity.addEventListener("click", function(){
    var cityVal = document.querySelector(".city");
    city = cityVal.value;
    removeDailyForecast();
    addCityButton();
    saveCity();
    getCurrentWeather(city);
    addDailyForecast();
});

var getCurrentWeather = function (place) {
    var apiUrlCurrent = 'https://api.openweathermap.org/data/2.5/weather?q='+ place + '&appid=' + APIkey;
    fetch(apiUrlCurrent).then(function(response){
        response.json().then(function(data){
            console.log(data);
            document.querySelector(".cityName").textContent = data.name + ", " + data.sys.country;
            document.querySelector(".todayDate").textContent = moment().format("MM-DD-YYYY");
            document.querySelector(".temperature").textContent = "Temperature: " + data.main.temp/10 + " °F";
            document.querySelector(".windSpeed").textContent = "Wind-Speed: " + data.wind.speed + " MPH";
            document.querySelector(".humidity").textContent = "Humidity: " + data.main.humidity + " %";
            

            var latitude = document.querySelector(".latitude");
            latitude.dataset.value = data.coord.lat;
            console.log(latitude.dataset.value);
            var longitude = document.querySelector(".longitude");
            longitude.dataset.value = data.coord.lon;
            console.log(longitude.dataset.value);

            document.querySelector(".notVisible").setAttribute("style", "display: none;");
            
            var apiURLNow = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude.dataset.value + "&lon=" + longitude.dataset.value + "&units=imperial" + "&appid=" + APIkey;
            fetch(apiURLNow).then(function(response){
                response.json().then(function(data){
                    console.log(data);
                    
                    var daily = data.daily;
                    console.log(daily);

                    document.querySelector(".UVIndex").textContent = "UVI: " + daily[0].uvi;
                    document.querySelector(".temperature").textContent = "Temperature: " + daily[0].temp.day + " °F";
                    document.querySelector(".windSpeed").textContent = "Wind-Speed: " + daily[0].wind_speed + " MPH";
                    document.querySelector(".humidity").textContent = "Humidity: " + daily[0].humidity + " %";

                    var cityName = document.querySelector(".cityName");
                    var tempPicture = document.createElement("img");
                    tempPicture.setAttribute('src', "https://openweathermap.org/img/wn/"+daily[0].weather[0].icon+"@2x.png");
                    cityName.appendChild(tempPicture);

                    for(var i = 1;i < daily.length; i++){
                        console.log(moment.unix(daily[i].dt).format("MM-DD-YY"));
                        daily.splice(6);

                        var dailyForecast = document.querySelector(".dailyForecast");
                    
                        var cardHolder = document.createElement("div");
                        cardHolder.setAttribute("class", "col-2 m-2 cardHolder");
                        dailyForecast.appendChild(cardHolder);
                        
                        var card = document.createElement("div");
                        card.setAttribute("class", "card");
                        card.setAttribute("style", "width: 10rem;");
                        cardHolder.appendChild(card);

                        var cardBody = document.createElement("div");
                        cardBody.setAttribute("class", "card-body");
                        card.appendChild(cardBody);

                        var cardTitle = document.createElement("h5");
                        cardTitle.setAttribute("class", "card-title");
                        cardTitle.textContent = moment.unix(daily[i].dt).format("MM-DD-YY");
                        cardBody.appendChild(cardTitle);

                        var cardSubTitle = document.createElement("img");
                        cardSubTitle.setAttribute("class", "card-subtitle mb-2 text-muted");
                        cardSubTitle.setAttribute('src', "https://openweathermap.org/img/wn/"+daily[i].weather[0].icon+"@2x.png");
                        cardBody.appendChild(cardSubTitle);

                        var temp = document.createElement("p");
                        temp.setAttribute("class", "card-text");
                        temp.textContent = daily[i].temp.day + " °F";
                        cardBody.appendChild(temp);

                        var wind = document.createElement("p");
                        wind.setAttribute("class", "card-text");
                        wind.textContent = daily[i].wind_speed + " MPH";
                        cardBody.appendChild(wind);

                        var humidity = document.createElement("p");
                        humidity.setAttribute("class", "card-text");
                        humidity.textContent = daily[i].humidity + "%";
                        cardBody.appendChild(humidity);
                    };
                });
            });
        });
    });
};

saveCityButton();

var cityButton = document.querySelectorAll(".cityButton");

console.log(cityButton.length);