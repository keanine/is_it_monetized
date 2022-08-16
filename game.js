
function start()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //console.log("URLParam: " + urlParams.get('id'));
    const gameID = urlParams.get('id');

    fetch('./data/game_database.json')
    .then(result => result.json())
    .then((allGameData) => {
        console.log('All Game Data: ', allGameData);
        
        //for (let i = 0; i < allGameData.length; i++)
        //{
            let gameData = allGameData.find(x => x.gameID === gameID);
            document.getElementById("gameTitle").textContent = gameData.title;
            document.getElementById("gameBoxart").src = gameData.boxart;
            
            fetch('./data/games/' + gameID + '.json')
            .then(result => result.json())
            .then((monetizationData) => {
                console.log('Monetization Data: ', monetizationData);

                for (let i = 0; i < monetizationData.length; i++)
                {
                }
            }).catch(err => console.error(err));
            
            //element.innerHTML += '<div class="reviewCard"  onclick="goto(\'game.html\', \''+ output[i].gameID + '\')"><img class="reviewThumbnail" alt="Game Boxart" src="' + boxart + '"><p class="reviewTitle">' + title + '</p><p class="reviewRating">' + rating + '</p>	</div>';
        //}
    }).catch(err => console.error(err));
}