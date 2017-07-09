const _ = require('underscore');
const moment = require('moment');

function getDeckCount(deck) {
    let count = 0;

    _.each(deck, function(card) {
        count += card.count;
    });

    return count;
}

function hasTrait(card, trait) {
    return card.card.traits && card.card.traits.toLowerCase().indexOf(trait.toLowerCase() + '.') !== -1;
}

function isBannerCard(bannerCode, faction) {
    switch(bannerCode) {
        // Banner of the stag
        case '01198':
            return faction === 'baratheon';
        // Banner of the kraken
        case '01199':
            return faction === 'greyjoy';
        // Banner of the lion
        case '01200':
            return faction === 'lannister';
        // Banner of the sun
        case '01201':
            return faction === 'martell';
        // Banner of the watch
        case '01202':
            return faction === 'thenightswatch';
        // Banner of the wolf
        case '01203':
            return faction === 'stark';
        // Banner of the dragon
        case '01204':
            return faction === 'targaryen';
        // Banner of the rose
        case '01205':
            return faction === 'tyrell';
    }

    return false;
}

function isCardInReleasedPack(packs, card) {
    let pack = _.find(packs, pack => {
        return card.card.pack_code === pack.code;
    });

    if(!pack) {
        return false;
    }

    let releaseDate = pack.available || pack.date_release;

    if(!releaseDate) {
        return false;
    }

    releaseDate = moment(releaseDate, 'YYYY-MM-DD');
    let now = moment();

    return releaseDate <= now;
}

module.exports = function validateDeck(deck, packs) {
    let plotCount = getDeckCount(deck.plotCards);
    let drawCount = getDeckCount(deck.drawCards);
    let status = 'Valid';
    let requiredPlots = 7;
    let isRains = false;
    let extendedStatus = [];
    let requiredDraw = 60;
    let isValid = true;

    if(_.any(deck.drawCards, card => {
        return !card.card.faction_code;
    })) {
        status = 'Invalid';
        extendedStatus.push('Deck contains invalid cards');

        return { status: status, plotCount: plotCount, drawCount: drawCount, extendedStatus: extendedStatus, isValid: false };
    }

    let combined = _.union(deck.plotCards, deck.drawCards);
    // Alliance
    if(deck.agenda && deck.agenda.code === '06018') {
        requiredDraw = 75;
        if(deck.bannerCards && (deck.bannerCards.length !== 0 && deck.bannerCards.length !== 2)) {
            status = 'Invalid';
            isValid = false;
            extendedStatus.push('Wrong number of banner cards');
        }
    }

    // "The Rains of Castamere"
    if(deck.agenda && deck.agenda.code === '05045') {
        isRains = true;
        requiredPlots = 12;
    }

    if(drawCount < requiredDraw) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few draw cards');
    }

    if(plotCount < requiredPlots) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('Too few plot cards');
    }

    if(_.any(combined, card => {
        if(card.count > card.card.deck_limit) {
            extendedStatus.push(card.card.label + ' has limit ' + card.card.deck_limit);

            return true;
        }

        return false;
    })) {
        isValid = false;
        status = 'Invalid';
    }

    if(plotCount > requiredPlots) {
        extendedStatus.push('Too many plots');
        status = 'Invalid';
        isValid = false;
    }

    if(isRains) {
        let schemePlots = _.filter(deck.plotCards, plot => {
            return hasTrait(plot, 'Scheme');
        });

        let groupedSchemes = _.groupBy(schemePlots, plot => {
            return plot.card.code;
        });

        if(_.size(groupedSchemes) !== 5 && !_.all(groupedSchemes, plot => {
            return plot.count === 1;
        })) {
            extendedStatus.push('Rains requires 5 different scheme plots');
            status = 'Invalid';
            isValid = false;
        }
    }

    // Kings of summer
    if(deck.agenda && deck.agenda.code === '04037' && _.any(deck.plotCards, card => {
        return hasTrait(card, 'winter');
    })) {
        extendedStatus.push('Kings of Summer cannot include Winter plots');
        status = 'Invalid';
        isValid = false;
    }

    // Kings of winter
    if(deck.agenda && deck.agenda.code === '04038' && _.any(deck.plotCards, card => {
        return hasTrait(card, 'summer');
    })) {
        extendedStatus.push('Kings of Winter cannot include Summer plots');
        status = 'Invalid';
        isValid = false;
    }

    // Fealty
    if(deck.agenda && deck.agenda.code === '01027' && _.reduce(deck.drawCards, (counter, card) => {
        return card.card.faction_code === 'neutral' ? counter + card.count : counter;
    }, 0) > 15) {
        status = 'Invalid';
        isValid = false;
        extendedStatus.push('You cannot include more than 15 neutral cards in a deck with Fealty');
    }

    // Alliance
    let bannerCards = {};
    if((!deck.agenda || deck.agenda && deck.agenda.code !== '06018') && !_.all(combined, card => {
        let faction = card.card.faction_code.toLowerCase();
        let bannerCard = false;

        if(deck.agenda && deck.agenda.code === '06018') {
            if(_.any(deck.bannerCards, banner => {
                return isBannerCard(banner.code, faction) && !card.card.is_loyal;
            })) {
                if(bannerCards[faction]) {
                    bannerCards[faction] += card.count;
                } else {
                    bannerCards[faction] = card.count;
                }

                bannerCard = true;
            }
        } else if(deck.agenda && isBannerCard(deck.agenda.code, faction) && !card.card.is_loyal) {
            if(bannerCards[faction]) {
                bannerCards[faction] += card.count;
            } else {
                bannerCards[faction] = card.count;
            }

            bannerCard = true;
        }

        return bannerCard || faction === deck.faction.value.toLowerCase() || faction === 'neutral';
    })) {
        extendedStatus.push('Too many out of faction cards');
        status = 'Invalid';
        isValid = false;
    }

    if(_.any(bannerCards, bannerCount => {
        return bannerCount < 12;
    })) {
        extendedStatus.push('Not enough banner faction cards');
        status = 'Invalid';
        isValid = false;
    }

    if(isValid) {
        let unreleasedCards = _.reject(combined, card => {
            return isCardInReleasedPack(packs, card);
        });

        if(_.size(unreleasedCards) !== 0) {
            status = 'Unreleased Cards';

            _.each(unreleasedCards, card => {
                extendedStatus.push(card.card.label + ' is not yet released');
            });
        }
    }

    return { status: status, plotCount: plotCount, drawCount: drawCount, extendedStatus: extendedStatus, isValid: isValid };
};
