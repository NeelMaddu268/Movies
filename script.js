//Variables
var url = "https://www.omdbapi.com/?t="; //https://imdb-api.com/en/API/SearchAll/k_7zx86fso/
var key = "&apikey=94dfa4e2";
var pageHoldItems = 10;
var pageNumber = 1;
var popResults;
var totalResults = 100;
var localStorageListCount = 6;
var globalData;
var movieNameInput = document.getElementById('movieName');

//Buttons
var startBtn = document.getElementById('startBtn');
var backBtn;
var nextBtn;
var popularButtonSearch;

//Pages
var popularChoosePage = document.getElementById('popularChoosePage');
var startPage = document.getElementById('startPage');
var popularViewPage = document.getElementById('popularViewPage');
var choosePage = document.getElementById("choosePage");
var loadingPage = document.getElementById("loadingPage");
var historyPage = document.getElementById("historyPage");
var creditsPage = document.getElementById("creditsPage");
var errorPage = document.getElementById("errorPage");

//Check if there is any local storage history
if (localStorage.getItem("history") == null) {
  //If there isn't, create it to prevent any potential errors.
  localStorage.setItem("history", []);
}

//Check if there is any local storage history
if (localStorage.getItem("historyCounter") == null) {
  //If there isn't, create it to prevent any potential errors.
  localStorage.setItem("historyCounter", []);
}
//Call the function to hide all of the pages
hidePages();

function hidePages() {
  //Set the display of all pages to none to hide them all
  choosePage.style.display = "none";
  viewPage.style.display = "none";
  popularChoosePage.style.display = "none";
  popularViewPage.style.display = "none";
  loadingPage.style.display = "none";
  historyPage.style.display = "none";
  creditsPage.style.display = "none";
}

//Focus the cursor onto the text input box to direct the user
movieNameInput.focus()

//Call a function everytime a letter is typed into the movie input box.
movieNameInput.addEventListener('input', updateValue);

function showCredits() {
  //If the showCredits function is called, it will hide the start page and will show the credits Page
  creditsPage.style.display = "block";
  startPage.style.display = "none";
}

function clickAllowed() {
  //Check to see if the data is supposed to be retrieved. Would fail in two scenarios: 
  //1. The user doesn't enter any value into the input box but still clicks enter
  //2. The user is not on the start page but clicks the enter button on the keyboard
  if (movieNameInput.value != "" && startPage.style.display != "none") {
    start();
  }
}

function updateValue() {
  //Whenever a letter is typed into the input box, get the current letters typed in and capitalize the first letter. Afterwards, update the input value with the uppercased word.
  str = movieNameInput.value
  movieNameInput.value = str.charAt(0).toUpperCase() + str.slice(1)
}

function popular() {
  //Send a jquery request 
  $.getJSON("https://imdb-api.com/en/API/MostPopularMovies/k_7zx86fso", function(data) {
    //Send the items of the recieved data into another function as a paramater
    recievePop(data.items);
  });
}

function switchPage(direction) {
  // the direction is next, page should show next 10 items
  if (direction == "next") {
    //Check to make sure that this is not the last page
    if (pageNumber != Math.ceil(100 / pageHoldItems)) {
      //Increase page number and disable the back button
      pageNumber++;
      backBtn.disabled = false
      //If current page is last page
      if (pageNumber == Math.ceil(100 / pageHoldItems)) {
        //Disable next button
        nextBtn.disabled = true;
      }
    }
    //Create elements
    makeListPop()
  } else {
    //Going back
    //Check page isn't first page
    if (pageNumber != 1) {
      //Decrease pageNumber
      pageNumber--;
      //Enable next button
      nextBtn.disabled = false;
      if (pageNumber == 1) {
        //Disable back button
        backBtn.disabled = true;
      }
    }
    //Create elements
    makeListPop()
  }
}

function recievePop(data) {
  // Store data in new variable
  popResults = data;

  // Hide the start page and show the popular movie choosing page
  popularChoosePage.style.display = "block";
  startPage.style.display = "none";

  // Create a button. Button click will reload page. Add style and make the cursor a pointer
  popularButtonSearch = document.createElement("button");
  popularButtonSearch.textContent = "Home";
  popularButtonSearch.addEventListener('click', () => { location.reload(); });
  popularButtonSearch.classList.add("getToHome")
  popularButtonSearch.style.cursor = "pointer";
  // Append to popularChoosePage
  popularChoosePage.appendChild(popularButtonSearch);

  // Create line space
  popularPageBr1 = document.createElement("br");
  // Append to popularChoosePage
  popularChoosePage.appendChild(popularPageBr1);

  // Create a button. Button click will go to the previous page. Add style and make the cursor a pointer
  backBtn = document.createElement("button");
  backBtn.textContent = "Back";
  backBtn.id = "backBtn";
  backBtn.addEventListener('click', () => { switchPage("back") });
  backBtn.classList.add("getToHome")
  backBtn.disabled = true;
  backBtn.style.cursor = "pointer";
  popularChoosePage.appendChild(backBtn);
  // Append to popularChoosePage

  // Create a button. Button click will go to the next page. Add style and make the cursor a pointer
  nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.id = "nextBtn";
  nextBtn.addEventListener('click', () => { switchPage("next") });
  nextBtn.classList.add("getToHome")
  nextBtn.style.cursor = "pointer";
  popularChoosePage.appendChild(nextBtn);
  // Append to popularChoosePage

  makeListPop()
  // Generate popular movie results
}

function makeListPop() {
  // Get all of h3 elements on page
  var deletingItems = popularChoosePage.querySelectorAll('h3');

  // Delete each item of the list
  for (var i = 0; i < deletingItems.length; i++) {
    deletingItems[i].remove();
  }

  // Add each current item 
  for (var i = (pageNumber - 1) * pageHoldItems; i < pageNumber * pageHoldItems; i++) {
    if (i >= totalResults) {
      break;
    }
    //  Add name of each of the popular movies
    item = document.createElement('h3');
    item.textContent = popResults[i].title;
    item.id = i;
    item.addEventListener('click', (i) => { popChosen(i) });
    item.style.cursor = "pointer";
    popularChoosePage.appendChild(item);

  }
}

function popChosen(chosen) {
  // Get details of chosen movie
  var chosenPop = popResults[parseInt(chosen.target.id)]

  // Hide and make some pages visible
  popularChoosePage.style.display = "none";
  popularViewPage.style.display = "block";

  var selectedPopMovieElements = [];

  // creates home button for page
  selectedPopMovieElements.push(document.createElement("button"));
  selectedPopMovieElements[selectedPopMovieElements.length - 1].textContent = "Home";
  selectedPopMovieElements[selectedPopMovieElements.length - 1].addEventListener('click', () => { location.reload(); });
  selectedPopMovieElements[selectedPopMovieElements.length - 1].classList.add("getToHome")
  // appends movie title to home screen
  selectedPopMovieElements.push(document.createElement("h4"));
  selectedPopMovieElements[selectedPopMovieElements.length - 1].classList.add("movieTitle")
  selectedPopMovieElements[selectedPopMovieElements.length - 1].textContent = chosenPop.title;


  exsistingArray = localStorage.getItem("history").split(",")
  // checks if the movie is in local history. if so, adds another statement at the top of the screen that says "You Have Searched For This Movie Before". If not, appends the normal items onto the screen.
  if (exsistingArray.includes(chosenPop.title)) {
    selectedPopMovieElements.push(document.createElement("h4"));
    selectedPopMovieElements[selectedPopMovieElements.length - 1].textContent = "You Have Searched For This Movie Before";
  } else {
    if (exsistingArray.length >= localStorageListCount) {
      exsistingArray.pop();
    }
    exsistingArray.unshift(chosenPop.title);
    localStorage.setItem("history", exsistingArray);
  }

  // Convert the movie name into a youtube link
  // Replace the spaces in the name with '+'
  // For loop to check each letter in the name

  var popTitleNameYTSplit = [];
  for (var i = 0; i < chosenPop.title.length; i++) {
    var currentLetter = chosenPop.title[i]
    if (currentLetter == " ") {
      popTitleNameYTSplit.push("+")
    } else {
      popTitleNameYTSplit.push(currentLetter)
    }
  }
  // Combines the list to form a string
  popTitleNameYTSplit = popTitleNameYTSplit.join("");
  
  // Appends YT link to movie trailer to the screen
selectedPopMovieElements.push(document.createElement("a"));
  selectedPopMovieElements[selectedPopMovieElements.length - 1].textContent = "Movie Trailer - Youtube";
  selectedPopMovieElements[selectedPopMovieElements.length - 1].href = "https://www.youtube.com/results?search_query=" + popTitleNameYTSplit + "+Trailer";

  selectedPopMovieElements[selectedPopMovieElements.length - 1].target = "_blank";

  // Adds some line breaks  
  selectedPopMovieElements.push(document.createElement("br"));
  selectedPopMovieElements.push(document.createElement("br"));
  
  // Appends a link leading to the website of AMC theaters with a preset search query using the same split movie name 
  selectedPopMovieElements.push(document.createElement("a"));
  selectedPopMovieElements[selectedPopMovieElements.length - 1].textContent = "AMC Theaters";
  selectedPopMovieElements[selectedPopMovieElements.length - 1].href = "https://www.amctheatres.com/search?q=" + popTitleNameYTSplit;

  selectedPopMovieElements[selectedPopMovieElements.length - 1].target = "_blank";

  // Creates new element for movie cast
  selectedPopMovieElements.push(document.createElement("h4"));
  selectedPopMovieElements[selectedPopMovieElements.length - 1].textContent = chosenPop.crew;
  // Creates new element for movie rating
  selectedPopMovieElements.push(document.createElement("h4"));
  selectedPopMovieElements[selectedPopMovieElements.length - 1].textContent = "Rating: " + chosenPop.imDbRating;
  // Creates new element for movie ranking
  selectedPopMovieElements.push(document.createElement("h4"));
  selectedPopMovieElements[selectedPopMovieElements.length - 1].textContent = "Rank: " + chosenPop.rank;
  // Creates new element for the release year
  selectedPopMovieElements.push(document.createElement("h4"));
  selectedPopMovieElements[selectedPopMovieElements.length - 1].textContent = "Release Year: " + chosenPop.year;
  // Creates new element for movie poster
  selectedPopMovieElements.push(document.createElement("img"));
  selectedPopMovieElements[selectedPopMovieElements.length - 1].src = chosenPop.image;
  selectedPopMovieElements[selectedPopMovieElements.length - 1].width = 500;

  // Appends all of the elements created above onto the screen
  for (var i = 0; i < selectedPopMovieElements.length; i++) {
    popularViewPage.appendChild(selectedPopMovieElements[i]);
  }
}

function start() {
  // Hide the start page
  // Show the loading page
  startPage.style.display = "none";
  loadingPage.style.display = "block";

  // Replace the spaces in movie name with '%20'
  var splitMovie = movieNameInput.value.split("");
  for (var i = 0; i < splitMovie.length; i++) {
    if (splitMovie[i] == " ") {
      splitMovie[i] = "%20";
    }
  }

  // Add to the url
  var movieUrl = splitMovie.join('');
  url += movieUrl;
  url += key;

  //Send JSon request to the url. Recieve data and pass it into select function
  $.getJSON(url, function(data) {
    //select(data);
      chosen(data,0);
  });

  // Reset value of url
  url = "https://www.omdbapi.com/?t=";

}

/*
function select(response) {
  startPage.style.display = "none";
  loadingPage.style.display = "none";
  choosePage.style.display = "block";
  results = response;
  //Generate
  var elements = [];
  // creates home button
  homeButtonSearch = document.createElement("button");
  homeButtonSearch.textContent = "Home";
  homeButtonSearch.addEventListener('click', () => { location.reload(); });
  homeButtonSearch.classList.add("getToHome")
  // sets cursor style to pointer
  homeButtonSearch.style.cursor = "pointer";

  elements.push(homeButtonSearch);

  // generates search result consisting of 8 results that are relevant to user's search query

  var nums = [1, 2, 3, 4, 5, 6, 7, 8];
  for (var index = 0; index < nums.length; index++) {
    // Give each element an id of it's index for no duplicates
    // Add required styles
    // Add event listener for onclick to redirect to chosen function while passing the index as a paramater
    elements.push(document.createElement('h3'));
    elements[elements.length - 1].id = index;
	 debugger;
    elements[elements.length - 1].textContent = nums[index] + ". " + results.results[index].title;
    elements[elements.length - 1].style.cursor = "pointer";
    elements[elements.length - 1].style.fontFamily = "'Lobster Two', cursive";
    elements[elements.length - 1].addEventListener('click', (index) => {
      chosen(index)
    });
  }

  // Appends all of the results elements that have been created in the for loop above to the current screen
  for (var current = 0; current < elements.length; current++) {
    choosePage.appendChild(elements[current]);
  }

}
*/

function chosen(data) {
  if (data != undefined && data.Response != "False"){  

  startPage.style.display = "none";
  loadingPage.style.display = "none";
  choosePage.style.display = "block";

  globalData = data;
  // Hide past page and make current page visible
  choosePage.style.display = "none";
  viewPage.style.display = "block";

  // Get id of the selected movie
  var selectedMovie = data;

  var selectedMovieElements = [];
  // creates home button and assigns onclick to reload the page to bring to home screen
  selectedMovieElements.push(document.createElement("button"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "Home";
  selectedMovieElements[selectedMovieElements.length - 1].addEventListener('click', () => { location.reload(); });

  // Changes cursor style to pointer
  selectedMovieElements[selectedMovieElements.length - 1].style.cursor = "pointer";

  // Adds the proper class to the button
  selectedMovieElements[selectedMovieElements.length - 1].classList.add("getToHome")

  // Appends selectedMovieElements to add the movie/TV show title to the screen and sets the movie title as the title of the screen.
  selectedMovieElements.push(document.createElement("h1"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = selectedMovie.Title;

  selectedMovieElements.push(document.createElement("h2"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "Released: " + selectedMovie.Released;

  // Appends selectedMovieElements to add the movie/TV show release date to the screen
  selectedMovieElements.push(document.createElement("h2"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "Rated: " + selectedMovie.Rated;
  
  selectedMovieElements.push(document.createElement("h2"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "Runtime: " + selectedMovie.Runtime;
  
  selectedMovieElements.push(document.createElement("h2"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "Genre: " + selectedMovie.Genre;
  
  selectedMovieElements.push(document.createElement("h2"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "Director: " + selectedMovie.Rated;
  
  selectedMovieElements.push(document.createElement("h2"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "IMDB Rating: " + selectedMovie.imdbRating;
  
  selectedMovieElements.push(document.createElement("h2"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "Box Office: " + selectedMovie.BoxOffice;
  
  // Appends selectedMovieElements to add the movie/TV show poster to the screen and sets the image dimensions to be displayed. If no movie poster is avilable, prints alterate message
  if (selectedMovie.Poster == "") {
    selectedMovieElements.push(document.createElement("h2"));
    selectedMovieElements[selectedMovieElements.length - 1].textContent = "Sorry, no movie/TV show poster available";
    selectedMovieElements[selectedMovieElements.length - 1].classList.add("noPoster")

  } else {
    selectedMovieElements.push(document.createElement("img"));
    selectedMovieElements[selectedMovieElements.length - 1].src = selectedMovie.Poster;
    selectedMovieElements[selectedMovieElements.length - 1].width = 400;
  }

  selectedMovieElements.push(document.createElement("br"));
  selectedMovieElements.push(document.createElement("br"));


  // Create an empty list to store values
  var titleNameYTSplit = [];

  // For each letter in the selected movie
  for (var i = 0; i < selectedMovie.Title.length; i++) {
    // Get current letter
    var currentLetter = selectedMovie.Title[i]
    //Replace spaces with +
    if (currentLetter == " ") {
      titleNameYTSplit.push("+")
    } else {
      titleNameYTSplit.push(currentLetter)
    }
  }

  //Combine full list
  titleNameYTSplit = titleNameYTSplit.join("");

  // Appends selectedMovieElements to display movie trailer link, also creates a hyperlink to lead to the link
  selectedMovieElements.push(document.createElement("a"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "Movie Trailer - Youtube";
  selectedMovieElements[selectedMovieElements.length - 1].href = "https://www.youtube.com/results?search_query=" + titleNameYTSplit + "+Trailer";
  selectedMovieElements[selectedMovieElements.length - 1].target = "_blank";

  // Adds line spaces
  selectedMovieElements.push(document.createElement("br"));
  selectedMovieElements.push(document.createElement("br"));

  // Appends selectedMovieElements to add the movie booking link to the screen and puts it in a hyperlink
  selectedMovieElements.push(document.createElement("a"));
  selectedMovieElements[selectedMovieElements.length - 1].textContent = "AMC Theaters";
  selectedMovieElements[selectedMovieElements.length - 1].href = "https://www.amctheatres.com/search?q=" + titleNameYTSplit;
  selectedMovieElements[selectedMovieElements.length - 1].target = "_blank";

  // Removes least recent item from history
  exsistingArray = localStorage.getItem("history").split(",")

  if (exsistingArray.length >= localStorageListCount) {
    exsistingArray.pop();
  }
  // Adds selected movie name to the front of the list
  exsistingArray.unshift(selectedMovie.Title);

  // Store the list in local storage
  localStorage.setItem("history", exsistingArray);

  for (var i = 0; i < selectedMovieElements.length; i++) {
    // Add all the created elements to the page
    document.getElementById('viewPage').appendChild(selectedMovieElements[i]);
  }
  }else{
    startPage.style.display = "none";
    loadingPage.style.display = "none";
    errorPage.style.display = "block";
  
  }
}

// Function that displays history
function history() {
  // Hide start page
  // Set history page to visible
  startPage.style.display = "none";
  historyPage.style.display = "block";

  // Creates a button to go home
  // Set button onclick to reload page
  // Add other required styles
  var historyHomeButton = document.createElement("button");
  historyHomeButton.textContent = "Home";
  historyHomeButton.addEventListener('click', () => { location.reload(); });
  historyHomeButton.classList.add("getToHome")
  historyHomeButton.style.cursor = "pointer";
  historyPage.appendChild(historyHomeButton);

  // Page break
  var historyPageBr1 = document.createElement("br")
  historyPage.appendChild(historyPageBr1);

  // Create a h1 title to indicate page name
  var historyPageTitle = document.createElement("h1")
  historyPageTitle.textContent = "History";
  historyPage.appendChild(historyPageTitle);


  // Store history in a variable
  var storedList = localStorage.getItem("history").split(",");
  storedList.pop()

  // For each value in the history list, create a h3
  // h3 should contain movie name
  // h3 onclick should call historyClicked function
  // Assigne required styles for the h3 element
  for (var i = 0; i < storedList.length; i++) {
    var currentStorageItem = document.createElement("h3");
    currentStorageItem.textContent = (i + 1) + ". " + storedList[i];
    currentStorageItem.addEventListener('click', (e) => { historyClicked(e) })
    currentStorageItem.style.cursor = "pointer";
    historyPage.appendChild(currentStorageItem);
  }

}

function historyClicked(e) {
  // Get the value of the name
  var name = e.target.textContent;
  name = name.substr(3, name.length - 3)

  // Set value of input box to name
  movieNameInput.value = name;

  // Hide history page
  // Set start page to visible
  historyPage.style.display = "none";
  startPage.style.display = "block";

  // Click the start button
  startBtn.click();
}

// Adds a evenlistener to the keydown input
document.addEventListener('keydown', checkKey);

function checkKey(e) {
  //Check for Right Arrow and that it is allowed
  if (e.key == "ArrowRight") {
    if (nextBtn.disabled == false) {
      // Means next page
      switchPage('next');
    }
    // Check for Left Arrow and that it is allowed
  } else if (e.key == "ArrowLeft") {
    if (backBtn.disabled == false) {
      // Means Previous Page
      switchPage('back');
    }
    //Enter Button Input
  } else if (e.keyCode == 13) {
    clickAllowed()
  }
}