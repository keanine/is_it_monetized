let fullDatabase;
let filteredDatabase;

let currentPage = 1; 
let searchTerm = "";
let sortByMethod = "release_date";
let gamesPerPage = 6;

let gameIndex = 0;

// Elements
let reviewListElement;

// Page Events

function onLoad()
{
    // initialize elements
    reviewListElement = document.getElementById("reviewList");

    //load json
    fetch('./data/game_database.json', 
    {
        headers: 
        {
            'Cache-Control': 'no-cache'
        }
    })
    .then(result => result.json())
    .then((loadedDatabase) => 
    {
        initializeDatabase(loadedDatabase);
        setupElements();
    }
    )
    .catch(err => console.error(err));
}

function searchEvent() 
{
    const textbox = document.getElementById("searchInput");
    searchTerm = textbox.value.toLowerCase();
    search();
    firstGamePage();
    reloadGamePage();
}

function sortDatabaseEvent()
{
    sortByMethod = document.getElementById("sortByDropdown").value;
    sortDatabase();
    reloadGamePage();
    firstGamePage();
    console.log("Sorted");
}

// Main Functions

function initializeDatabase(data)
{
    // initialize data variables
    fullDatabase = data;
    filteredDatabase = fullDatabase;

    // load from URL params
    currentPage = Number(tryGetParamFromURL("page", currentPage));
    searchTerm = tryGetParamFromURL("search", searchTerm);
    sortByMethod = tryGetParamFromURL("sortby", sortByMethod);
    gamesPerPage = Number(tryGetParamFromURL("perpage", gamesPerPage));

    //apply search
    search();
    firstGamePage();

    //load page
    reloadGamePage();
}

function updateGameIndex()
{
    if (currentPage == null || currentPage == 0)
    {
        currentPage = 1;
        gameDataIndex = 0;
    }
    else
    {
        gameDataIndex = (currentPage - 1) * gamesPerPage;
    }
}

function setupElements()
{
    document.getElementById("sortByDropdown").value = sortByMethod;

    var input = document.getElementById("searchInput");
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("searchButton").click();
        }
    });
}

// General Helper Functions

function goto(page, arg)
{
    window.location.href = page + '?id=' + arg;
}

function getParamFromURL(paramName)
{
    const allParamsString = window.location.search;
    const urlParams = new URLSearchParams(allParamsString);
    return urlParams.get(paramName);
}

function tryGetParamFromURL(paramName, backupValue)
{
    const allParamsString = window.location.search;
    const urlParams = new URLSearchParams(allParamsString);
    let value = urlParams.get(paramName);

    if (value == null)
    {
        return backupValue;
    }
    else
    {
        return value;
    }
}

function setParamInURL(paramName, paramContent)
{
    const allParamsString = window.location.search;
    const urlParams = new URLSearchParams(allParamsString);
    const existingParam = urlParams.get(paramName);
    
    let refresh = allParamsString;

    if (existingParam == null)
    {
        let firstParam = refresh.indexOf('?') == -1;
        if (firstParam)
        {
            refresh += '?' + paramName + '=' + paramContent;
        }
        else
        {
            refresh += '&' + paramName + '=' + paramContent;
        }
    }
    else
    {
        refresh = refresh.replace(existingParam, paramContent);
    }

    if (paramContent == "" || paramContent == null)
    {
        let firstParam = refresh.indexOf('?') == -1;
        if (firstParam)
        {
            refresh = refresh.replace('?' + paramName + '=', "");
        }
        else
        {
            refresh = refresh.replace('&' + paramName + '=', "");
        }
    }

    window.history.pushState({ path: refresh }, '', refresh);
}

function search()
{
    let searchResults = [];

    if (searchTerm != null && searchTerm != "")
        setParamInURL("search", searchTerm);

    for (let i = 0; i < fullDatabase.length; i++)
    {
        let databaseTitle = fullDatabase[i].title.replace(/^"(.+)"$/,'$1').toLowerCase();
        if (databaseTitle.includes(searchTerm))
        {
            searchResults.push(fullDatabase[i]);
        }
    }

    filteredDatabase = searchResults;
    
    sortDatabase();
}

function sortDatabase()
{
    document.getElementById("sortByDropdown").value = sortByMethod;

    if (sortByMethod == "release_date")
    {
        setParamInURL("sortby", "release_date");
        sortDatabaseByReleaseDate();
    }
    else if (sortByMethod == "alphabetical") 
    {
        setParamInURL("sortby", "alphabetical");
        sortDatabaseByAlphabetical();
    }
}

function sortDatabaseByAlphabetical()
{
    filteredDatabase.sort((a, b) => a.title.localeCompare(b.title))
}

function sortDatabaseByReleaseDate()
{
    filteredDatabase.sort(function(a, b) {
        var keyA = new Date(a.releaseDate),
          keyB = new Date(b.releaseDate);
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
}

function reloadGamePage()
{
    reviewListElement.innerHTML = "";
    
    for (let i = gameIndex; i < gameIndex + gamesPerPage; i++)
    {
        if (i < filteredDatabase.length)
        {
            let gameID = filteredDatabase[i].gameID;
            let title = filteredDatabase[i].title;
            let rating = filteredDatabase[i].rating;
            let saleType = filteredDatabase[i].saleType;
            let boxart = filteredDatabase[i].boxart;
            let steamID = filteredDatabase[i]["steamID"];

            if (steamID != undefined && steamID != null) {
                boxart = `https://steamcdn-a.akamaihd.net/steam/apps/${steamID}/library_600x900.jpg`;
            }
                    
            let elementCode = `
            <div class="reviewCard" onclick="goto(\'game\', \'${gameID}\')">
                <img draggable="false" class="reviewThumbnail" alt="Game Boxart" src="${boxart}">
                <p class="reviewTitle">${title}</p>
                <p class="reviewSaleType">${saleType}</p>
                <p class="reviewRating">${rating}</p>
            </div>
            `;

            reviewListElement.innerHTML += elementCode;
        }
        else
        {
            break;
        }
    }
    createPaginationBar();
}

// Pagination

function nextGamePage()
{
    if (gameIndex + gamesPerPage < filteredDatabase.length)
    {
        gameIndex += gamesPerPage;
        currentPage++;
        setParamInURL("page", currentPage);
        reloadGamePage();
    }
}

function prevGamePage()
{
    if (gameIndex - gamesPerPage >= 0)
    {
        gameIndex -= gamesPerPage;
        currentPage--;
        setParamInURL("page", currentPage);
        reloadGamePage();
    }
}

function firstGamePage()
{
    gameIndex = 0;
    currentPage = 1;
    setParamInURL("page", currentPage);
    reloadGamePage();
}

function lastGamePage()
{
    let max_pages = filteredDatabase.length / gamesPerPage;
    max_pages = Math.ceil(max_pages);

    gameIndex = (max_pages - 1) * gamesPerPage;
    currentPage = max_pages;
    setParamInURL("page", currentPage);
    reloadGamePage();
}

function goToGamePage(target_page)
{
    let target_index = (target_page - 1) * gamesPerPage;
    if (target_index >= 0 && target_index < filteredDatabase.length)
    {
        currentPage = target_page;
        gameIndex = target_index;
        setParamInURL("page", currentPage);
        reloadGamePage();
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
            pageContainer.innerHTML += '<div class="paginationCurrent paginationButton paginationPage" onclick="goToGamePage(' + i + ')">' + i + '</div>';
        else
            pageContainer.innerHTML += '<div class="paginationButton paginationPage" onclick="goToGamePage(' + i + ')">' + i + '</div>';
        
            pageButtonCount++;

        if (pageButtonCount >= maxPageButtonCount)
            break;
    }
}