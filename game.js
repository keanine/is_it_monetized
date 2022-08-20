function addMonetizationCard(text)
{
    let container = document.getElementById("monetizationCardContainer");
    let monetizationCardElement = `                    
    <div class="monetizationCard"><div class="cardText">${text}</div><svg class="checkmark" viewBox="0 0 24 24"><use href="#svgCheckmarkCross" /><use href="#svgCheckmarkTick" style="display: none;" /></svg><div class="tags"></div></div>
    `

    container.innerHTML += monetizationCardElement;
}

function start()
{
    addMonetizationCard("Paid");
    addMonetizationCard("Paid DLC");
    addMonetizationCard("Microtransactions");
    addMonetizationCard("Advertisements");
    addMonetizationCard("Season Pass");
    addMonetizationCard("Premium Battle Pass");
    addMonetizationCard("Premium Currency");
    addMonetizationCard("Premium Loot Boxes");
    addMonetizationCard("Premium Cosmetics");
    addMonetizationCard("Deluxe Edition");
    addMonetizationCard("Pre-order Bonus");
    addMonetizationCard("Subscription");
    addMonetizationCard("Pay to Win");
    addMonetizationCard("Timed Store");
    addMonetizationCard("NFTs");
    addMonetizationCard("Player Market");

    var cards = document.querySelectorAll('.monetizationCard');

    // for (let i = 0; i < cards.length; i+=3)
    // {
    //     var tagsContainer = cards[i].querySelector('.tags');
    //     if (tagsContainer)
    //     {
    //         tagsContainer.innerHTML += '<div class="tag"><img class="tagIcon" src="assets/svg/tag.svg" /><div class="tagText">cosmetic only</div></div>';    
    //     }
    // }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameID = urlParams.get('id');

    const checkmarkCollection = document.getElementsByClassName("checkmark");

    fetch('./data/game_database.json', {
        headers: {
            'Cache-Control': 'no-cache'
        }
    }).then(result => result.json())
    .then((allGameData) => {        
        
        let gameData = allGameData.find(x => x.gameID === gameID);
        document.getElementById("gameTitle").textContent = gameData.title;
        document.getElementById("gameBoxart").src = gameData.boxart;
        
        fetch('./data/games/' + gameID + '.json', {
            headers: {
                'Cache-Control': 'no-cache'
            }
        }).then(result => result.json())
        .then((monetizationData) => {

            if (monetizationData.Paid >= 1) activateCheckmark(checkmarkCollection[0]);
            if (monetizationData.PaidDLC >= 1) activateCheckmark(checkmarkCollection[1]);
            if (monetizationData.Microtransactions >= 1) activateCheckmark(checkmarkCollection[2]);
            if (monetizationData.Advertisements >= 1) activateCheckmark(checkmarkCollection[3]);
            if (monetizationData.SeasonPass >= 1) activateCheckmark(checkmarkCollection[4]);
            if (monetizationData.PremiumBattlePass >= 1) activateCheckmark(checkmarkCollection[5]);
            if (monetizationData.PremiumCurrency >= 1) activateCheckmark(checkmarkCollection[6]);
            if (monetizationData.PremiumLootBoxes >= 1) activateCheckmark(checkmarkCollection[7]);
            if (monetizationData.PremiumCosmetics >= 1) activateCheckmark(checkmarkCollection[8]);
            if (monetizationData.DeluxeEdition >= 1) activateCheckmark(checkmarkCollection[9]);
            if (monetizationData.PreorderBonus >= 1) activateCheckmark(checkmarkCollection[10]);
            if (monetizationData.Subscription >= 1) activateCheckmark(checkmarkCollection[11]);
            if (monetizationData.PayToWin >= 1) activateCheckmark(checkmarkCollection[12]);
            if (monetizationData.FOMOMechanics >= 1) activateCheckmark(checkmarkCollection[13]);
            if (monetizationData.NFTs >= 1) activateCheckmark(checkmarkCollection[14]);
            if (monetizationData.PlayerMarket >= 1) activateCheckmark(checkmarkCollection[15]);

        }).catch(err => console.error(err));
    }).catch(err => console.error(err));
}

function changeCheckmarkColor(svgElement, color) {
    var svgItem = svgElement.getElementById("svgCheckmark");
	svgItem.setAttribute("fill", color);
}

function activateCheckmark(element) {
    element.classList.add("checkmarkActive");
    element.children[0].style.display = "none";
    element.children[1].style.display = "block";
}