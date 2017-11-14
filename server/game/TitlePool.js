const _ = require('underscore');

const titles = [
    require('./cards/titles/CrownRegent.js'),
    require('./cards/titles/HandOfTheKing.js'),
    require('./cards/titles/MasterOfCoin.js'),
    require('./cards/titles/MasterOfLaws.js'),
    require('./cards/titles/MasterOfShips.js'),
    require('./cards/titles/MasterOfWhispers.js')
];

class TitlePool {
    constructor(game, cardData) {
        this.game = game;
        this.cards = titles.map(titleClass => {
            let title = new titleClass({ game: game }, cardData[titleClass.code] || {});
            title.moveTo('title pool');
            return title;
        });
    }

    getCardsForSelection() {
        let amount = this.amountToSetAside();
        let shuffledPool = _.shuffle(this.cards);

        return _.first(shuffledPool, this.cards.length - amount);
    }

    amountToSetAside() {
        if(this.game.noTitleSetAside) {
            return 0;
        }

        let players = this.game.getPlayers();

        if(players.length >= 6) {
            return 0;
        } else if(players.length >= 4) {
            return 1;
        }

        return 2;
    }

    chooseFromPool(player, card) {
        if(!this.cards.includes(card)) {
            return;
        }

        card.controller = player;
        card.moveTo('title');
        card.applyPersistentEffects();
        player.title = card;
    }

    returnToPool(player, card) {
        if(!card || card.getType() !== 'title') {
            return;
        }

        card.controller = null;
        card.moveTo('title pool');
        player.title = null;
    }
}

module.exports = TitlePool;
