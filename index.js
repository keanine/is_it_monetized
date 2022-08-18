
let reviewListElement;
let gameDataIndex = 0;
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
        updateURL();
        loadPage();
    }
}

function prevPage()
{
    if (gameDataIndex - gamesPerPage >= 0)
    {
        gameDataIndex -= gamesPerPage;
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

            reviewListElement.innerHTML += '<div class="reviewCard"  onclick="goto(\'game\', \''+ gameID + '\')"><img class="reviewThumbnail" alt="Game Boxart" src="' + boxart + '"><p class="reviewTitle">' + title + '</p><p class="reviewRating">' + rating + '</p>	</div>';
        }
        else
        {
            return;
        }
    }
}

function updateURL()
{        
    var pageNumber = 1 + (gameDataIndex / gamesPerPage);
    var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?page=' + pageNumber;    
    window.history.pushState({ path: refresh }, '', refresh);
}

function recoverGameIndexFromURL()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const param = urlParams.get('page');

    if (param == null)
    {
        gameDataIndex = 0;
    }
    else
    {
        gameDataIndex = (param - 1) * gamesPerPage;
    }
}

    // Game Page

    // let jsonID = json.gameID;
    // fetch('./data/games/' + jsonID + '.json')
    // .then(result => result.json())
    // .then((output) => {
    //     console.log('Output: ', output.Paid);
    // }).catch(err => console.error(err));