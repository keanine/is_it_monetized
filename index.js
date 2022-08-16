

function start()
{
    // const para = document.createElement("p");
    // const node = document.createTextNode("This is new.");
    // para.appendChild(node);

    // const element = document.getElementById("reviewList");
    // element.appendChild(para);

    // require(['game_data.json'], function (jsonData) {
    //     //foo is now loaded.
    //     console.log(jsonData);
    // });

    fetch('./game_data.json')
    .then(result => result.json())
    .then((output) => {
        console.log('Output: ', output);
        
}).catch(err => console.error(err));

    //var data = JSON.parse(fs.readFileSync("game_data.json"));
    //console.log(data.collection.length);

    const element = document.getElementById("reviewList");

    element.innerHTML += '<div class="reviewCard"><img class="reviewThumbnail" alt="Game Boxart" src="https://cdn2.steamgriddb.com/file/sgdb-cdn/grid/f66a0c26ea3a640283a18af4915c577a.png"><p class="reviewTitle">Control</p><p class="reviewRating">Low</p>	</div>';
}