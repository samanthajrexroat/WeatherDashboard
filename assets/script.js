//DECLARE VARIABLES
var today = moment().format('L');
var currentCity = "";
var mainDiv = $(".mainDiv");
var searchHistory = $("#search-history");
var current = $("#city-info");
var fiveDay = $("#five-day");



const apiKey = 'ac785b3f1975916150e8a5fa906406d0'

var historyArray = JSON.parse(localStorage.getItem("cityKey")) || [];

for (i=0; i<historyArray.length; i++) {
    var cityBtn = `<button id="btn${i}" value=${historyArray[i]}>${historyArray[i]}</button><br>`
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
        var cityBtn = `<button value=${city}>${city}</button><br>`
        searchHistory.append(cityBtn);
    }
    
    // SET local storage here --- array of city names
    localStorage.setItem("cityKey", JSON.stringify(historyArray));
    // IF the city is already in the array, don't push
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
            var p1 = `<p>City:${city}</p>`
            var iconCode = `${data2.daily[0].weather[0].icon}`
            var iconUrl = `<img src= https://openweathermap.org/img/w/${iconCode}.png> `
            
            var p2 = `<p>Temp:${data2.daily[0].temp.day}</p>`
            var p3 = `<p>Wind:${data2.daily[0].wind_speed}</p>`
            var p4 = `<p>Humidity:${data2.daily[0].humidity}</p>`
            var p5 = `<p class="uvi">UV Index:${data2.daily[0].uvi}</p>`
            current.append(p1,today,iconUrl,p2,p3,p4,p5)
            if (data2.daily[0].uvi < 5){
                $(".uvi").css("background-color", "green")
            }// }else if (data2.daily[0].uvi > ){

            // }else{

            // }

            for (i=1; i<6; i++){
                var fourDaysForward = new moment().add(i, 'day');
                var cardDiv = `
                <div class="cardDiv">
                    <p>${fourDaysForward.format('L')}</p>
                    <p>Temp:${data2.daily[i].temp.day}</p>
                    <p>Wind:${data2.daily[i].wind_speed}</p>
                    <p>Humidity:${data2.daily[i].humidity}</p>
                    <p class="uvi${i}">UV Index:${data2.daily[i].uvi}</p>
                </div>
                `
                fiveDay.append(cardDiv);

                if (data2.daily[i].uvi < 5){
                    $(`.uvi${i}`).css("background-color", "green")
                }// }else if (data2.daily[i].uvi > ){
    
                // }else{
                    
                // }
            }
        })

    
}
