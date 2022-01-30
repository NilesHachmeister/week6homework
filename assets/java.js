let todaysDate = $("#todays-date")
let ul = $("ul")
let searchBtn = $(".form-inline")

let m = moment().format("(MM/DD/YYYY)");



// search city grabs the city
// creates a list item under the history. clicking on this list itempulls up the search again

// the search calls the api
// it takes the information and displays the current and the next days cards

// I may have to brute force the cards instead of looping though

// create a conditional about the uv index to change the colors depending

// figure out the emoji situation. if i can use that in the api or if i have to make a conditional about it











function init() {
    console.log("java is connected");
    todaysDate.text(m)
    renderHistory()
};


function renderHistory() {
    console.log("history rendered");
}

function saveSearch(e) {
    e.preventDefault();
    let searchContent = $(".form-control").val().trim()
    console.log(searchContent);
    
}


init()



searchBtn.on("submit", saveSearch)