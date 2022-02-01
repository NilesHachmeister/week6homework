let todaysDate = $("#todays-date")
let ul = $("ul")
let searchBtn = $(".form-inline")
const weatherForcast = $("#weather-forcast")
const cardRow = $("#card-row")

let m = moment().format("(MM/DD/YYYY)");

const weatherKey = "00c14fcd6e9b9c227fcc096ac537dbd1"
let cityName = ""

let searchContent = "";


let lat = "";
let lon = ""


// clicking on this list itempulls up the search again


// it takes the information and displays the current and the next days cards

// I may have to brute force the cards instead of looping though


// uv coloring
// past button click functionality
// card population
// hidden weather thing at first





// add if match function



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
            weatherForcast.show();
            setCurrentDay(data2);

            renderCard(data2);
        });

}

function setCurrentDay(data2) {


    $("#temp").text("Temp: " + data2.current.temp + " °F")
    $("#wind").text("Wind: " + data2.current.wind_speed + " MPH")
    $("#humidity").text("Humidity: " + data2.current.humidity + " %")
    $("#uv").text("UV Index: " + data2.current.uvi)
    let icon = data2.current.weather[0].icon


    todaysDate.html(searchContent + " " + m + "<img src='http://openweathermap.org/img/w/" + icon + ".png' alt='An icon showing the weather conditions'>");



}



function renderCard(data2) {

    $(".custom-card").remove()

    for (let index = 1; index < 6; index++) {




        let card = $("<div>")
        card.addClass("card col-2 custom-card mx-2")
        cardRow.append(card)

        let h5 = $("<h5>")
        h5.html(moment.unix(data2.daily[index].dt).format("MM/DD/YYYY") + "<img src='http://openweathermap.org/img/w/" + data2.daily[index].weather[0].icon + ".png' alt='An icon showing the weather conditions'>")
        card.append(h5)




        // let p1 = $("<p>")
        // p1.text("emoji")
        // card.append(p1)

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






function init() {
    weatherForcast.hide();
    todaysDate.text(m);
    renderHistory();

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
    searchContent = $(".form-control").val().trim()
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