

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
            let rating = output[i].rating;
            let boxart = output[i].boxart;
            
            element.innerHTML += '<div class="reviewCard"><img class="reviewThumbnail" alt="Game Boxart" src="' + boxart + '"><p class="reviewTitle">' + title + '</p><p class="reviewRating">' + rating + '</p>	</div>';
        }
    }).catch(err => console.error(err));
}