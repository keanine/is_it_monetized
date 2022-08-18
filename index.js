
let reviewListElement;
let gameDataIndex = 0;
const gamesPerPage = 6;

let database;

function start()
{
    reviewListElement = document.getElementById("reviewList");

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

function nextPage()
{
    if (gameDataIndex + gamesPerPage < database.length)
    {
        reviewListElement.innerHTML = "";
        gameDataIndex += gamesPerPage;
        loadPage();
    }
}

function prevPage()
{
    if (gameDataIndex - gamesPerPage >= 0)
    {
        reviewListElement.innerHTML = "";
        gameDataIndex -= gamesPerPage;
        loadPage();
    }
}

function loadPage()
{
    for (let i = gameDataIndex; i < gameDataIndex + gamesPerPage; i++)
    {
        let gameID = database[i].gameID;
        let title = database[i].title;
        let rating = database[i].rating;
        let boxart = database[i].boxart;

        if (i < database.length)
        {
            reviewListElement.innerHTML += '<div class="reviewCard"  onclick="goto(\'game\', \''+ gameID + '\')"><img class="reviewThumbnail" alt="Game Boxart" src="' + boxart + '"><p class="reviewTitle">' + title + '</p><p class="reviewRating">' + rating + '</p>	</div>';
        }
        else
        {
            return;
        }
    }
}

    // Game Page

    // let jsonID = json.gameID;
    // fetch('./data/games/' + jsonID + '.json')
    // .then(result => result.json())
    // .then((output) => {
    //     console.log('Output: ', output.Paid);
    // }).catch(err => console.error(err));