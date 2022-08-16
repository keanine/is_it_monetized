

function start()
{
    const element = document.getElementById("reviewList");

    fetch('./game_data.json')
    .then(result => result.json())
    .then((output) => {
        console.log('Output: ', output);
        
        for (let i = 0; i < output.length; i++)
        {
            let title = output[i].title;
            console.log(title);
            element.innerHTML += '<div class="reviewCard"><img class="reviewThumbnail" alt="Game Boxart" src="https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/f66a0c26ea3a640283a18af4915c577a.png"><p class="reviewTitle">' + title + '</p><p class="reviewRating">Low</p>	</div>';
        }
    }).catch(err => console.error(err));
}