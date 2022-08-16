
function start()
{
    const element = document.getElementById("gameBlock");

    fetch('./data/game_database.json')
    .then(result => result.json())
    .then((allGameData) => {
        console.log('All Game Data: ', allGameData);
        
        for (let i = 0; i < allGameData.length; i++)
        {
            document.getElementById("gameTitle").textContent = allGameData[i].title;

            
            fetch('./data/games/' + allGameData[i].gameID + '.json')
            .then(result => result.json())
            .then((monetizationData) => {
                console.log('Monetization Data: ', monetizationData);

                for (let i = 0; i < monetizationData.length; i++)
                {
                }
            }).catch(err => console.error(err));
            
            //element.innerHTML += '<div class="reviewCard"  onclick="goto(\'game.html\', \''+ output[i].gameID + '\')"><img class="reviewThumbnail" alt="Game Boxart" src="' + boxart + '"><p class="reviewTitle">' + title + '</p><p class="reviewRating">' + rating + '</p>	</div>';
        }
    }).catch(err => console.error(err));
}