let todaysDate = $("#todays-date")
let ul = $("ul")
let searchBtn = $(".form-inline")

let m = moment().format("(MM/DD/YYYY)");

const weatherKey = "00c14fcd6e9b9c227fcc096ac537dbd1"
let cityName = ""



let lat = "";
let lon = ""

// search city grabs the city
// creates a list item under the history. clicking on this list itempulls up the search again

// the search calls the api
// it takes the information and displays the current and the next days cards

// I may have to brute force the cards instead of looping though

// create a conditional about the uv index to change the colors depending

// figure out the emoji situation. if i can use that in the api or if i have to make a conditional about it







function callApi() {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            lat = data.coord.lat
            lon = data.coord.lon
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherKey}`)
        })
        .then(function (response2) {
            return response2.json();
        })
        .then(function (data2) {
            console.log(data2);
            $("#temp").text("Temp: " + data2.current.temp + " °F")
            $("#wind").text("Wind: " + data2.current.wind_speed + " MPH")
            $("#humidity").text("Humidity: " + data2.current.humidity + " %")
            $("#uv").text("UV Index: " + data2.current.uvi)
            let icon = data2.current.weather[0].icon


            todaysDate.html(m + "<img src='http://openweathermap.org/img/w/" + icon + ".png' alt='An icon showing the weather conditions'>");

        });

}





// add if match function



function init() {
    todaysDate.text(m)
    renderHistory()

};


function renderHistory() {


    for (let index = 0; index < 8; index++) {

        const element = JSON.parse(localStorage.getItem([index]));

        if (element != null) {


            let listItem = $("<li>")
            listItem.text(element)
            listItem.addClass("btn btn-secondary w-100 my-2 mx-0")
            ul.append(listItem)




        }
    }
}

function saveSearch(e) {
    e.preventDefault();
    let searchContent = $(".form-control").val().trim()
    console.log(searchContent);
    reasignStorage()
    cityName = searchContent
    console.log(cityName);

    $("li").remove()

    localStorage.setItem("0", JSON.stringify(searchContent));

    // if it doesnt match, add it, if it does match, dont add it, just go there
    renderHistory()
    callApi()



}



function reasignStorage() {

    let store0 = JSON.parse(localStorage.getItem("0"));
    let store1 = JSON.parse(localStorage.getItem("1"));
    let store2 = JSON.parse(localStorage.getItem("2"));
    let store3 = JSON.parse(localStorage.getItem("3"));
    let store4 = JSON.parse(localStorage.getItem("4"));
    let store5 = JSON.parse(localStorage.getItem("5"));
    let store6 = JSON.parse(localStorage.getItem("6"));


    localStorage.setItem("7", JSON.stringify(store6));
    localStorage.setItem("6", JSON.stringify(store5));
    localStorage.setItem("5", JSON.stringify(store4));
    localStorage.setItem("4", JSON.stringify(store3));
    localStorage.setItem("3", JSON.stringify(store2));
    localStorage.setItem("2", JSON.stringify(store1));
    localStorage.setItem("1", JSON.stringify(store0));
}





init()



searchBtn.on("submit", saveSearch)