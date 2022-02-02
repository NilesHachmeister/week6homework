// getting element from the html
let todaysDate = $("#todays-date");
const ul = $("ul");
const searchBtn = $(".form-inline");
const searchHistory = $("#search-history");
const weatherForcast = $("#weather-forcast");
const cardRow = $("#card-row");

// declaring my key for the weather api
const weatherKey = "00c14fcd6e9b9c227fcc096ac537dbd1";

//setting todays date 
let m = moment().format("(MM/DD/YYYY)");

// declaring my global variables
let cityName = "";
let lat = "";
let lon = "";
let previousCityCheck;




// this fuction runs on page load
function init() {

    // this sets the current day
    todaysDate.text(m);

    // this hides elements of the html until they are given values
    weatherForcast.hide();
    $(".forcast").hide();
    $("#error-div").hide()
    $("#weather-card").hide()

    // this shows the search history
    renderHistory();
};

// this function creates and shows the search history
function renderHistory() {

    // this cycles through all of the locations stored in local storage
    for (let index = 0; index < 8; index++) {

        const element = JSON.parse(localStorage.getItem([index]));

        // this checks to make sure that there is something stored in local storage at the key location
        if (element != null) {

            //  if something is in local storage a button is created for it
            let listItem = $("<li>")
            listItem.text(element)
            listItem.addClass("btn btn-secondary w-100 my-2 mx-0")
            ul.append(listItem)
        }
    }
}


// this function calls the api
function callApi() {

    // this fetches the information from the api based on the city the user searches for
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherKey}`)
        .then(function (response) {

            // this throws up an error if the city searched does not exsist. it also hides and shows things accordingly
            if (response.status === 404) {
                $("#weather-card").hide()
                $("#error-div").show()
                weatherForcast.hide()
                $(".forcast").hide()

                return;

                // this  hides and swos things if the weather app does get information for the city back
            } else if (response.status == 200) {
                $("#error-div").hide()
                $("#weather-card").show()
                weatherForcast.show()
                $(".forcast").show()

                // this takes the data and puts it in json format
                return response.json();
            }

        })
        .then(function (data) {

            // this takes that data and gets the lat and long from it. it then searches one call for that city
            lat = data.coord.lat
            lon = data.coord.lon
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherKey}`)
        })
        .then(function (response2) {

            // this takes the response and turns it into json format
            return response2.json();
        })
        .then(function (data2) {

            // this takes that data and sets the current day weather info with it as well as the forcast cards
            setCurrentDay(data2);
            renderCard(data2);

            // this checks if the city was part of the search history
            if (previousCityCheck == 0) {

                // if the city was not already searched all of the storage is reasigned, removed from the page, the new city is stored, and the search history is reloaded
                reasignStorage()
                $("li").remove()
                localStorage.setItem("0", JSON.stringify(cityName));
                renderHistory()
            }
        });
}

// this function sets the weather of the current day
function setCurrentDay(data2) {

    // this sets each line based on the current weather
    let icon = data2.current.weather[0].icon
    $("#temp").text("Temp: " + data2.current.temp + " °F")
    $("#wind").text("Wind: " + data2.current.wind_speed + " MPH")
    $("#humidity").text("Humidity: " + data2.current.humidity + " %")
    $("#uv").text("UV Index: ")
    todaysDate.html(cityName + " " + m + "<img src='http://openweathermap.org/img/w/" + icon + ".png' alt='An icon showing the weather conditions'>");

    // this checks the value of the uv index and changes the background color of it depending on the value
    let uvNumber = $("#uv-number")
    uvNumber.text(data2.current.uvi)
    if (data2.current.uvi < 3) {
        uvNumber.css("background-color", "green")
    } else if (6 > data2.current.uvi && data2.current.uvi >= 3) {
        uvNumber.css("background-color", "yellow")
        uvNumber.css("color", "black")
    } else if (8 > data2.current.uvi && data2.current.uvi >= 6) {
        uvNumber.css("background-color", "orange")
    } else if (11 > data2.current.uvi && data2.current.uvi >= 8) {
        uvNumber.css("background-color", "red")
    } else {
        uvNumber.css("background-color", "violet")
    }
}


// this 
function renderCard(data2) {

    // this removes all previous cards
    $(".custom-card").remove()

    // this creates all cards based on the time sense epoch and the values given by the api
    for (let index = 1; index < 6; index++) {


        let card = $("<div>")
        card.addClass("card col-2 custom-card mx-2")
        cardRow.append(card)

        let h5 = $("<h5>")
        h5.html(moment.unix(data2.daily[index].dt).format("MM/DD/YYYY") + "<img src='http://openweathermap.org/img/w/" + data2.daily[index].weather[0].icon + ".png' alt='An icon showing the weather conditions'>")
        card.append(h5)


        let p1 = $("<p>")
        p1.text("Temp: " + data2.daily[index].temp.day + " °F")
        card.append(p1)

        let p2 = $("<p>")
        p2.text("Wind: " + data2.daily[index].wind_speed + " MPH")
        card.append(p2)

        let p3 = $("<p>")
        p3.text("Humidity: " + data2.daily[index].humidity + " %")
        card.append(p3)
    }
}





function searchSubmit(e) {

    // this prevents the default of a page reloading on the form submition
    e.preventDefault();

    // this sets cityName to whatever the input value was
    cityName = $(".form-control").val().trim()

    // this resets the previous city check value to 0 
    previousCityCheck = 0;

    // this goes through the storage and checks if there if each storage item matches the current search
    for (let index = 0; index < 8; index++) {
        let element = JSON.parse(localStorage.getItem([index]));

        // this checks to make sure that there is a city in the current storage spot
        if (element !== null) {

            // this compares the current city to the one in storag
            if (element.toLowerCase() == cityName.toLowerCase()) {

                // this indicates that the city has already been set to storage and calls the api
                previousCityCheck++
                callApi();
            }
        }
    }

    // this calls the api if the city typed in is not a city that is already in storage
    if (previousCityCheck === 0) {
        callApi()
    }

    // this takes clears the value of the search bar
    $(".form-control").val("")
}

// this function reasigns everything in storage one spot later
function reasignStorage() {

    // this asignes everythirng in storage (other than the last item) to a variable
    let store0 = JSON.parse(localStorage.getItem("0"));
    let store1 = JSON.parse(localStorage.getItem("1"));
    let store2 = JSON.parse(localStorage.getItem("2"));
    let store3 = JSON.parse(localStorage.getItem("3"));
    let store4 = JSON.parse(localStorage.getItem("4"));
    let store5 = JSON.parse(localStorage.getItem("5"));
    let store6 = JSON.parse(localStorage.getItem("6"));

    // this takes the variables and asignes them to places in local storage (other than the first local storage slot)
    localStorage.setItem("7", JSON.stringify(store6));
    localStorage.setItem("6", JSON.stringify(store5));
    localStorage.setItem("5", JSON.stringify(store4));
    localStorage.setItem("4", JSON.stringify(store3));
    localStorage.setItem("3", JSON.stringify(store2));
    localStorage.setItem("2", JSON.stringify(store1));
    localStorage.setItem("1", JSON.stringify(store0));
}


// this function checks which city was clicked, and researches it.
function findSearch(e) {

    // this checks to make sure that it is a list item that is clicked, 
    if (e.target.tagName.toLowerCase() === "li") {

        //  this sets the city name to the one that is clicked
        cityName = $(e.target).text()

        // this calls the api
        callApi();

        // this marks that the city has already been seen, that way we do not create another list item for it
        previousCityCheck++
    }
}

// this start the program on page load
init()

// this event listener listens for the search being submitted. when it is submited it runs the save search
searchBtn.on("submit", searchSubmit)

// this event listener 
searchHistory.on("click", findSearch)