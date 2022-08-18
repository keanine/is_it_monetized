
let reviewListElement;
let gameDataIndex = 0;
let currentPage = 1;
const gamesPerPage = 6;

let database;

function start()
{
    reviewListElement = document.getElementById("reviewList");

    recoverGameIndexFromURL();

    fetch('./data/game_database.json')
    .then(result => result.json())
    .then((output) => {
        database = output;
        loadPage();
    }).catch(err => console.error(err));
}

function goto(page, arg)
{
    window.location.href = page + '?id=' + arg;
}

function sortResultsInDatabase()
{
    //Sort by date
}

function nextPage()
{
    if (gameDataIndex + gamesPerPage < database.length)
    {
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
        gameDataIndex -= gamesPerPage;
        currentPage -= 1;
        updateURL();
        loadPage();
    }
}

function goToPage(targetPage)
{
    targetIndex = (targetPage - 1) * gamesPerPage;
    if (targetIndex >= 0 && targetIndex < database.length)
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
        if (i < database.length)
        {
            let gameID = database[i].gameID;
            let title = database[i].title;
            let rating = database[i].rating;
            let boxart = database[i].boxart;

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
    var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?page=' + currentPage;    
    window.history.pushState({ path: refresh }, '', refresh);
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

function createPaginationBar()
{
    const pageContainer = document.getElementById("paginationPages");
    pageContainer.innerHTML = "";

    let maxPages = database.length / gamesPerPage;
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