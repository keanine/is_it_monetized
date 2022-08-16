

function start()
{
    const element = document.getElementById("reviewList");

    fetch('./data/game_database.json')
    .then(result => result.json())
    .then((output) => {
        console.log('Output: ', output);
        
        for (let i = 0; i < output.length; i++)
        {
            let title = output[i].title;
            let rating = output[i].rating;
            let boxart = output[i].boxart;
            
            element.innerHTML += '<div class="reviewCard"  onclick="goto(\'game.html\', \''+ output[i].gameID + '\')"><img class="reviewThumbnail" alt="Game Boxart" src="' + boxart + '"><p class="reviewTitle">' + title + '</p><p class="reviewRating">' + rating + '</p>	</div>';
        }
    }).catch(err => console.error(err));
}

function goto(page, arg)
{
    window.location.href = page + '?id=' + arg;
}

    // Game Page

    // let jsonID = json.gameID;
    // fetch('./data/games/' + jsonID + '.json')
    // .then(result => result.json())
    // .then((output) => {
    //     console.log('Output: ', output.Paid);
    // }).catch(err => console.error(err));