//DECLARE VARIABLES
var today = `<h3> ${moment().format('L')} </h3>`;
var currentCity = "";
var mainDiv = $(".mainDiv");
var searchHistory = $("#search-history");
var current = $("#city-info");
var fiveDay = $("#five-day");

const apiKey = 'ac785b3f1975916150e8a5fa906406d0'

var historyArray = JSON.parse(localStorage.getItem("cityKey")) || [];

for (i=0; i<historyArray.length; i++) {
    var cityBtn = `<button id="btn${i}" type ="button" class="btn btn-secondary col-12 m-1" value=${historyArray[i]}>${historyArray[i]}</button><br>`
    searchHistory.append(cityBtn);
    $(`#btn${i}`).click(function(event){
        console.log(event.target);
        var city = event.target.value;
        currentConditions(city);
    });
}

$(".submit").on("click", function(event) {
    event.preventDefault();
    var city = $(".cityInput").val();
    
    if (historyArray.includes(city)){
        return
    }else{
        historyArray.push(city)
        var cityBtn = `<buttontype ="button" class="btn btn-secondary col-12 m-1" value=${city}>${city}</button><br>`
        searchHistory.append(cityBtn);
    }
    
    localStorage.setItem("cityKey", JSON.stringify(historyArray));
    $(".cityInput").val('');

    currentConditions(city);
});

function currentConditions (city) {
    var queryUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    fetch(queryUrl)
        .then(function(cityApiResponse){
        console.log(cityApiResponse);
        return cityApiResponse.json()
    })
    .then(function(data){
        var lat = data[0].lat
        var lon = data [0].lon
        fetchData(lat, lon, city)
        $("#weather-content").css("display", "block");
        $("#city-info").empty();
    })
}

function fetchData(lat, lon, city){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${apiKey}`)
        .then(function(response){
            return response.json()
        })
        .then(function(data2){
            console.log(data2);
            var cityHead = `<h2>${city}</h2>`
            var iconCode = `${data2.daily[0].weather[0].icon}`
            var iconUrl = `<img src= https://openweathermap.org/img/w/${iconCode}.png class="img-fluid"> `
            var p2 = `<p>Temp:  ${data2.daily[0].temp.day} &#176;F</p>`
            var p3 = `<p>Wind:  ${data2.daily[0].wind_speed} MPH</p>`
            var p4 = `<p>Humidity:  ${data2.daily[0].humidity} %</p>`
            var p5 = `<p>UV Index: <span class="badge ">${data2.daily[0].uvi}</span></p>`
            current.append(cityHead,today,iconUrl,p2,p3,p4,p5)
            if (data2.daily[0].uvi < 3){
                $(".badge").css({"background-color": "green", "color": "white"});
            }else if (data2.daily[0].uvi > 6 ){
                $(".badge").css({"background-color": "red", "color": "white"});
            }else{
                $(".badge").css({"background-color": "yellow", "color": "black"});
            }

            $("#five-day").empty();

            for (i=1; i<6; i++){
                var fourDaysForward = new moment().add(i, 'day');
                var cardDiv = `
                <div class="card text-white bg-dark m-3 cardDiv" style="max-width: 10rem;">
                    <div class="card-body">
                        <h5>${fourDaysForward.format('L')}</h5>
                        <img src= https://openweathermap.org/img/w/${iconCode}.png class="img-fluid">
                        <p>Temp:  ${data2.daily[i].temp.day} &#176;F</p>
                        <p>Wind:  ${data2.daily[i].wind_speed} MPH</p>
                        <p>Humidity:  ${data2.daily[i].humidity} %</p>
                    </div>
                </div>
                `
                fiveDay.append(cardDiv);

            }
        })
}

$(document).ready(function() {
    var searchHistoryArr = JSON.parse(localStorage.getItem("cityKey"));

    if (searchHistoryArr !== null) {
        var lastSearchedIndex = searchHistoryArr.length - 1;
        var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
        currentConditions(lastSearchedCity);
        console.log(`Last searched city: ${lastSearchedCity}`);
    }
});