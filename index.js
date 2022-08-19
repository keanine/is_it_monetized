
let reviewListElement;
let gameDataIndex = 0;
let currentPage = 1;
const gamesPerPage = 6;
let searchTerm;

let database;
let filteredDatabase;

let usingPageArg = false;
let usingSearchArg = false;

function start()
{
    reviewListElement = document.getElementById("reviewList");

    setupPage();
    recoverGameIndexFromURL();

    fetch('./data/game_database.json', {
        headers: {
            'Cache-Control': 'no-cache'
        }
    }).then(result => result.json())
    .then((output) => {
        database = output;
        filteredDatabase = database;
        
        recoverSearchFromURL();
        loadPage();
    }).catch(err => console.error(err));
}

function goto(page, arg)
{
    window.location.href = page + '?id=' + arg;
}

function setupPage()
{
    var input = document.getElementById("searchInput");

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("searchButton").click();
        }
    });
}

function sortResultsInDatabase()
{
    //Sort by date
}

function nextPage()
{
    if (gameDataIndex + gamesPerPage < filteredDatabase.length)
    {
        usingPageArg = true;
        gameDataIndex += gamesPerPage;
        currentPage += 1;
        updateURL();
        loadPage();
    }
}

function prevPage()
{
    if (gameDataIndex - gamesPerPage >= 0)
    {
        usingPageArg = true;
        gameDataIndex -= gamesPerPage;
        currentPage -= 1;
        updateURL();
        loadPage();
    }
}

function firstPage()
{
    usingPageArg = true;
    gameDataIndex = 0;
    currentPage = 1;
    updateURL();
    loadPage();
}

function lastPage()
{    
    usingPageArg = true;
    let maxPages = filteredDatabase.length / gamesPerPage;
    maxPages = Math.ceil(maxPages);

    gameDataIndex = (maxPages - 1) * gamesPerPage;
    currentPage = maxPages;
    updateURL();
    loadPage();
}

function goToPage(targetPage)
{
    usingPageArg = true;
    targetIndex = (targetPage - 1) * gamesPerPage;
    if (targetIndex >= 0 && targetIndex < filteredDatabase.length)
    {
        currentPage = targetPage;
        gameDataIndex = targetIndex;
        updateURL();
        loadPage();
    }
}

function loadPage()
{
    reviewListElement.innerHTML = "";
    
    for (let i = gameDataIndex; i < gameDataIndex + gamesPerPage; i++)
    {
        if (i < filteredDatabase.length)
        {
            let gameID = filteredDatabase[i].gameID;
            let title = filteredDatabase[i].title;
            let rating = filteredDatabase[i].rating;
            let boxart = filteredDatabase[i].boxart;

            reviewListElement.innerHTML += '<div class="reviewCard" onclick="goto(\'game\', \''+ gameID + '\')"><img draggable="false" class="reviewThumbnail" alt="Game Boxart" src="' + boxart + '"><p class="reviewTitle">' + title + '</p><p class="reviewRating">' + rating + '</p>	</div>';
        }
        else
        {
            break;
        }
    }
    createPaginationBar();
}

function updateURL()
{        
    var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname;    
    
    if (usingPageArg)
    {
        refresh += generateParam("page", currentPage);
    }
    if (usingSearchArg && searchTerm != null && searchTerm != "")
    {
        refresh += generateParam("search", searchTerm);
    }
    
    window.history.pushState({ path: refresh }, '', refresh);
    // document.getElementById("title").innerText = "Is it Monetized (Page " + currentPage + ")";
    
    firstParam = true;
}

let firstParam = true;
function generateParam(paramName, paramContent)
{
    if (firstParam)
    {
        firstParam = false;
        return '?' + paramName + '=' + paramContent;
    }
    else
    {
        return '&' + paramName + '=' + paramContent;
    }

}

function recoverGameIndexFromURL()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = Number(urlParams.get('page'));

    if (param == null || param == 0)
    {
        currentPage = 1;
        gameDataIndex = 0;
    }
    else
    {
        currentPage = param;
        gameDataIndex = (param - 1) * gamesPerPage;
    }
}

function recoverSearchFromURL()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get('search');

    if (param != null)
    {
        searchTerm = param.toLowerCase();
        search(false);
    }
}

function searchUsingInputBar()
{
    const textbox = document.getElementById("searchInput");
    searchTerm = textbox.value.toLowerCase();
    search(true);
}

function search(resetPage)
{
    let searchResults = [];

    for (let i = 0; i < database.length; i++)
    {
        console.log(database[i].title + " | " + searchTerm);
        let databaseTitle = database[i].title.replace(/^"(.+)"$/,'$1');
        console.log(databaseTitle + " | " + searchTerm);
        if (databaseTitle.includes(searchTerm))
        {
            searchResults.push(database[i]);
        }
    }

    usingSearchArg = true;
    filteredDatabase = searchResults;

    if (resetPage)
    {
        firstPage();
    }
}

function createPaginationBar()
{
    const pageContainer = document.getElementById("paginationPages");
    pageContainer.innerHTML = "";

    let maxPages = filteredDatabase.length / gamesPerPage;
    maxPages = Math.ceil(maxPages);

    let maxPageButtonCount = 7;
    let pageButtonCount = 0;

    if (maxPages < maxPageButtonCount)
    {
        maxPageButtonCount = maxPages;
    }

    // Show your current page in the center if possible
     let leftSide = 0
     let rightSide = 0
     if (maxPageButtonCount% 2 == 0)
     {
        leftSide = (maxPageButtonCount/2) + 1;
        rightSide = (maxPageButtonCount/2) - 2;
     }
     else
     {
        leftSide = Math.floor(maxPageButtonCount/2);
        rightSide = Math.floor(maxPageButtonCount/2);
     }

    let firstButton = currentPage - leftSide;
    let lastButton = maxPages + 1 + rightSide;
    
    if (currentPage - leftSide <= 0)
    {
        let difference = 0-(firstButton - 1);
        firstButton += difference;
        lastButton += difference;
    }
    
    if (currentPage + rightSide > maxPages)
    {
        let difference = (maxPages - rightSide) - currentPage
        firstButton += difference;
        lastButton += difference;
    }

    // Generate the buttons
    for (let i = firstButton; i < lastButton; i++)
    {
        if (i == currentPage)
            pageContainer.innerHTML += '<div class="paginationCurrent paginationButton paginationPage" onclick="goToPage(' + i + ')">' + i + '</div>';
        else
            pageContainer.innerHTML += '<div class="paginationButton paginationPage" onclick="goToPage(' + i + ')">' + i + '</div>';
        
            pageButtonCount++;

        if (pageButtonCount >= maxPageButtonCount)
            break;
    }
}