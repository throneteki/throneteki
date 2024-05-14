const shuffle = require('lodash.shuffle');

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
        this.cards = titles.map((titleClass) => {
            let title = new titleClass({ game: game }, cardData[titleClass.code] || {});
            title.moveTo('title pool');
            return title;
        });
    }

    getCardsForSelection() {
        let amount = this.amountToSetAside();
        let shuffledPool = shuffle(this.cards);

        return shuffledPool.slice(0, this.cards.length - amount);
    }

    amountToSetAside() {
        if (this.game.noTitleSetAside) {
            return 0;
        }

        let players = this.game.getPlayers();

        if (players.length >= 6) {
            return 0;
        } else if (players.length >= 4) {
            return 1;
        }

        return 2;
    }

    chooseFromPool(player, card) {
        if (!this.cards.includes(card)) {
            return;
        }

        card.takeControl(player, this);
        card.moveTo('title');
        card.applyPersistentEffects();
        player.title = card;
    }

    returnToPool(player, card) {
        if (!card || card.getType() !== 'title') {
            return;
        }

        card.revertControl(this);
        card.moveTo('title pool');
        player.title = null;
    }
}

module.exports = TitlePool;
