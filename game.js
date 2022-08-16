function start()
{    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameID = urlParams.get('id');

    const checkmarkCollection = document.getElementsByClassName("checkmark");
    for (let i = 0; i < checkmarkCollection.length; i++) {
        changeCheckmarkColor(checkmarkCollection[i], "#c7c7c7");
        //changeCheckmarkColor(collection[i], "#ff9900");
    }

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

                console.log();
                if (monetizationData.Paid >= 1) changeCheckmarkColor(checkmarkCollection[0], "#ff9900");
                if (monetizationData.PaidDLC >= 1) changeCheckmarkColor(checkmarkCollection[1], "#ff9900");
                if (monetizationData.Microtransactions >= 1) changeCheckmarkColor(checkmarkCollection[2], "#ff9900");
                if (monetizationData.Advertisements >= 1) changeCheckmarkColor(checkmarkCollection[3], "#ff9900");
                if (monetizationData.SeasonPass >= 1) changeCheckmarkColor(checkmarkCollection[4], "#ff9900");
                if (monetizationData.PremiumBattlePass >= 1) changeCheckmarkColor(checkmarkCollection[5], "#ff9900");
                if (monetizationData.PremiumCurrency >= 1) changeCheckmarkColor(checkmarkCollection[6], "#ff9900");
                if (monetizationData.PremiumLootBoxes >= 1) changeCheckmarkColor(checkmarkCollection[7], "#ff9900");
                if (monetizationData.PremiumCosmetics >= 1) changeCheckmarkColor(checkmarkCollection[8], "#ff9900");
                if (monetizationData.DeluxeEdition >= 1) changeCheckmarkColor(checkmarkCollection[9], "#ff9900");
                if (monetizationData.PreorderBonus >= 1) changeCheckmarkColor(checkmarkCollection[10], "#ff9900");
                if (monetizationData.Subscription >= 1) changeCheckmarkColor(checkmarkCollection[11], "#ff9900");
                if (monetizationData.PayToWin >= 1) changeCheckmarkColor(checkmarkCollection[12], "#ff9900");
                if (monetizationData.FOMOMechanics >= 1) changeCheckmarkColor(checkmarkCollection[13], "#ff9900");
                if (monetizationData.NFTs >= 1) changeCheckmarkColor(checkmarkCollection[14], "#ff9900");
                if (monetizationData.PlayerMarket >= 1) changeCheckmarkColor(checkmarkCollection[15], "#ff9900");

                // console.log('Monetization Data: ', monetizationData);

                // console.log(checkmarkCollection);
                // for (let i = 0; i < checkmarkCollection.length; i++)
                // {
                //     console.log(checkmarkCollection[i]);
                //     changeCheckmarkColor(checkmarkCollection[i], "#ff9900");
                // }
            }).catch(err => console.error(err));
            
            //element.innerHTML += '<div class="reviewCard"  onclick="goto(\'game.html\', \''+ output[i].gameID + '\')"><img class="reviewThumbnail" alt="Game Boxart" src="' + boxart + '"><p class="reviewTitle">' + title + '</p><p class="reviewRating">' + rating + '</p>	</div>';
        //}
    }).catch(err => console.error(err));
}

function changeCheckmarkColor(svgElement, color) {
    var svgItem = svgElement.contentDocument.getElementById("svgMain");
	svgItem.setAttribute("fill", color);
}