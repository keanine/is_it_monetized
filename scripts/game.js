let checkmarkCollection;

function addMonetizationCard(data)
{
    let text = data.name;

    let container = document.getElementById("monetizationCardContainer");
    let cardCount = document.querySelectorAll('.monetizationCard').length;

    let verticalAlignText = "";
    if (data.tags.length == 0)
    {
        verticalAlignText = "cardTextCentered";
    }

    let monetizationCardElement = `
    <div class="monetizationCard noselect">
        <div class="cardText ${verticalAlignText}">
            ${text}
        </div>
        <svg class="checkmark checkmark${cardCount}" viewBox="0 0 24 24">
            <use href="#svgCheckmarkCross" />
            <use href="#svgCheckmarkTick" style="display: none;" />
        </svg>
        <div class="tags" id="card${cardCount}tags">
        </div>
    </div>
    `;

    container.innerHTML += monetizationCardElement;
    var tagsContainer = container.querySelector(`#card${cardCount}tags`);
    //container.appendChild(monetizationCardElement);
    for (let i = 0; i < data.tags.length; i++)
    {
        addTagToCard(tagsContainer, data.tags[i]);
    }

    var checkmark = container.querySelector(`.checkmark${cardCount}`);
    if (data.value == true) 
    {
        activateCheckmark(checkmark);
    }
}

function addTagToCard(cardTags, tagText)
{
    cardTags.innerHTML += `
    <div class="tag">
        <img class="tagIcon" src="assets/svg/tag.svg" />
        <div class="tagText">
            ${tagText}
        </div>
    </div>
    `;
}

function start()
{
    // var cards = document.querySelectorAll('.monetizationCard');

    // for (let i = 0; i < cards.length; i+=3)
    // {
    //     var tagsContainer = cards[i].querySelector('.tags');
    //     if (tagsContainer)
    //     {
    //         addTagToCard(tagsContainer, "test");
    //     }
    // }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameID = urlParams.get('id').toLowerCase();

    fetch('./data/game_database.json', {
        headers: {
            'Cache-Control': 'no-cache'
        }
    }).then(result => result.json())
    .then((allGameData) => {        
        
        let gameData = allGameData.find(x => x.gameID === gameID);

        let title = gameData.title;
        let boxart = gameData.boxart;
        let steamID = gameData["steamID"];

        if (steamID != undefined && steamID != null) {
            boxart = `https://steamcdn-a.akamaihd.net/steam/apps/${steamID}/library_600x900.jpg`;
        }

        document.getElementById("gameTitle").textContent = title;
        document.getElementById("gameBoxart").src = boxart;
        
        fetch('./data/games/' + gameID + '.json', {
            headers: {
                'Cache-Control': 'no-cache'
            }
        }).then(result => result.json())
        .then((cardData) => {
            checkmarkCollection = document.getElementsByClassName("checkmark");

            
            //addMonetizationCard("Paid", cardData.Paid, ["Digital", "Physical"]);
            addMonetizationCard(cardData.Paid);
            addMonetizationCard(cardData.PaidDLC);
            addMonetizationCard(cardData.DeluxeEdition);
            addMonetizationCard(cardData.PreorderBonus);
            //addMonetizationCard("Microtransactions", cardData.Microtransactions);
            //addMonetizationCard(cardData.SeasonPass);
            addMonetizationCard(cardData.GameplayMTX);
            addMonetizationCard(cardData.TimedStore);
            addMonetizationCard(cardData.PremiumBattlePass);
            addMonetizationCard(cardData.PremiumCurrency);
            addMonetizationCard(cardData.PremiumLootBoxes);
            addMonetizationCard(cardData.PremiumCosmetics);
            addMonetizationCard(cardData.Advertisements);
            //addMonetizationCard("Pay to Win", cardData.PayToWin);
            addMonetizationCard(cardData.Subscription);
            addMonetizationCard(cardData.NFTs);
            addMonetizationCard(cardData.PlayerMarket);

            // if (monetizationData.Paid >= 1) activateCheckmark(checkmarkCollection[0]);
            // if (monetizationData.PaidDLC >= 1) activateCheckmark(checkmarkCollection[1]);
            // if (monetizationData.Microtransactions >= 1) activateCheckmark(checkmarkCollection[2]);
            // if (monetizationData.Advertisements >= 1) activateCheckmark(checkmarkCollection[3]);
            // if (monetizationData.SeasonPass >= 1) activateCheckmark(checkmarkCollection[4]);
            // if (monetizationData.PremiumBattlePass >= 1) activateCheckmark(checkmarkCollection[5]);
            // if (monetizationData.PremiumCurrency >= 1) activateCheckmark(checkmarkCollection[6]);
            // if (monetizationData.PremiumLootBoxes >= 1) activateCheckmark(checkmarkCollection[7]);
            // if (monetizationData.PremiumCosmetics >= 1) activateCheckmark(checkmarkCollection[8]);
            // if (monetizationData.DeluxeEdition >= 1) activateCheckmark(checkmarkCollection[9]);
            // if (monetizationData.PreorderBonus >= 1) activateCheckmark(checkmarkCollection[10]);
            // if (monetizationData.Subscription >= 1) activateCheckmark(checkmarkCollection[11]);
            // if (monetizationData.PayToWin >= 1) activateCheckmark(checkmarkCollection[12]);
            // if (monetizationData.FOMOMechanics >= 1) activateCheckmark(checkmarkCollection[13]);
            // if (monetizationData.NFTs >= 1) activateCheckmark(checkmarkCollection[14]);
            // if (monetizationData.PlayerMarket >= 1) activateCheckmark(checkmarkCollection[15]);

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