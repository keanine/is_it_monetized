
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
    delaySearchbarAnimation();

    reviewListElement = document.getElementById("reviewList");

    setupPage();
    recoverGameIndexFromURL();

    fetch('./data/game_database.json', 
    {
        headers: 
        {
            'Cache-Control': 'no-cache'
        }
    })
    .then(result => result.json())
    .then((output) => 
    {
        database = output;
        sortList(true);
        filteredDatabase = database;
        
        recoverSearchFromURL();
        loadPage();
    }
    )
    .catch(err => console.error(err));
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

function sortList(init)
{
    let sortParam = getParamFromURL("sortby");
    
    if (sortParam && init)
    {
        document.getElementById("sortByDropdown").value = sortParam;

        if (sortParam == "releaseDate") {
            if (init == false)
                setParamInURL("sortby", "releaseDate");
    
            sortDatabaseByReleaseDate();
        }
        else if (sortParam == "alphabetical") {
            if (init == false)
                setParamInURL("sortby", "alphabetical");
    
            sortDatabaseByAlphabetical();
        }
    }
    else
    {
        let value = document.getElementById("sortByDropdown").value;

        if (value == "releaseDate") {
            if (init == false)
                setParamInURL("sortby", "releaseDate");
    
            sortDatabaseByReleaseDate();
        }
        else if (value == "alphabetical") {
            if (init == false)
                setParamInURL("sortby", "alphabetical");
    
            sortDatabaseByAlphabetical();
        }
    }
    filteredDatabase = database;
    loadPage();
    firstPage();
}

function sortDatabaseByAlphabetical()
{
    database.sort((a, b) => a.title.localeCompare(b.title))
}

function sortDatabaseByReleaseDate()
{
    database.sort(function(a, b) {
        var keyA = new Date(a.releaseDate),
          keyB = new Date(b.releaseDate);
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
}

function nextPage()
{
    if (gameDataIndex + gamesPerPage < filteredDatabase.length)
    {
        usingPageArg = true;
        gameDataIndex += gamesPerPage;
        currentPage += 1;
        setParamInURL("page", currentPage);
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
        setParamInURL("page", currentPage);
        loadPage();
    }
}

function firstPage()
{
    usingPageArg = true;
    gameDataIndex = 0;
    currentPage = 1;
    setParamInURL("page", currentPage);
    loadPage();
}

function lastPage()
{    
    usingPageArg = true;
    let maxPages = filteredDatabase.length / gamesPerPage;
    maxPages = Math.ceil(maxPages);

    gameDataIndex = (maxPages - 1) * gamesPerPage;
    currentPage = maxPages;
    setParamInURL("page", currentPage);
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
        setParamInURL("page", currentPage);
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

function getParamFromURL(paramName)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get(paramName);
    return param;
}

function setParamInURL(paramName, paramContent)
{
    const queryURL = window.location.search;
    const urlParams = new URLSearchParams(queryURL);
    const existingParam = urlParams.get(paramName);
    
    var refresh = queryURL;

    if (existingParam == null)
    {
        let firstParam = queryURL.indexOf('?') == -1;
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

    window.history.pushState({ path: refresh }, '', refresh);
}

function recoverGameIndexFromURL()
{
    const param = getParamFromURL("page");

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
    const param = getParamFromURL("search");
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
        let databaseTitle = database[i].title.replace(/^"(.+)"$/,'$1').toLowerCase();
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

function delaySearchbarAnimation()
{
    const elem = document.getElementById("searchInput");
    let padding = 12;
    let border = 2;
    let searchBarOffset = elem.offsetWidth - (padding*2);

    elem.style.width = 0 + 'px';
    elem.style.paddingLeft = 0;
    elem.style.paddingRight = 0;
    elem.style.borderLeft = 0;
    elem.style.borderRight = 0;
    
    const button = document.getElementById("searchButton");
    button.style.borderTopLeftRadius = "5px";
    button.style.borderBottomRadius = "5px";

    setTimeout(function() {
        button.style.borderTopLeftRadius = "0px";
        button.style.borderBottomRadius = "0px";
        animationSearchbar(searchBarOffset, padding, border);
    }, 200);
}

function animationSearchbar(targetWidth, targetPadding, targetBorder) {
    let id = null;
    const elem = document.getElementById("searchInput");
    let width = 0;
    let padding = 0;
    let border = 0;

    clearInterval(id);
    id = setInterval(frame, 5);
    function frame() {
      if (width >= targetWidth) {
        elem.style.width = targetWidth + 'px';
        clearInterval(id);
      } else {
        width += 6;
        elem.style.width = width + 'px';

        if (padding < targetPadding)
        {
            padding++;
            elem.style.paddingLeft = padding + "px";
            elem.style.paddingRight = padding + "px";
        }

        if (border < targetBorder)
        {
            border++;
            elem.style.borderLeft = border + "px";
            elem.style.borderRight = border + "px";
        }
      }
    }
}