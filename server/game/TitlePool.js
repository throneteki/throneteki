import shuffle from 'lodash.shuffle';

const titles = [
    (await import('./cards/titles/CrownRegent.js')).default,
    (await import('./cards/titles/HandOfTheKing.js')).default,
    (await import('./cards/titles/MasterOfCoin.js')).default,
    (await import('./cards/titles/MasterOfLaws.js')).default,
    (await import('./cards/titles/MasterOfShips.js')).default,
    (await import('./cards/titles/MasterOfWhispers.js')).default
];

class TitlePool {
    constructor(game, cardData) {
        this.game = game;
        this.cards = titles.map(
            (titleClass) => new titleClass({ game: game }, cardData[titleClass.code] || {})
        );
    }

    getCardsForSelection() {
        const amount = this.amountToSetAside();
        const shuffledPool = shuffle(this.cards);
        this.game.addMessage(
            'Titles have been shuffled, and {0} {1} been removed at random',
            amount,
            amount === 1 ? 'has' : 'have'
        );
        return shuffledPool.slice(0, this.cards.length - amount);
    }

    amountToSetAside() {
        if (this.game.noTitleSetAside) {
            return 0;
        }

        const players = this.game.getPlayers();

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
        card.facedown = true;
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

    announceTitles(selections) {
        const players = this.game.getPlayers();

        for (const selection of selections) {
            selection.title.facedown = false;
            selection.title.applyPersistentEffects();

            const supports = players.filter((player) =>
                selection.title.supporterNames.includes(player.title.name)
            );
            const rivals = players.filter((player) =>
                selection.title.rivalNames.includes(player.title.name)
            );
            this.game.addMessage(
                '{0} is {1}, supports {2}, and rivals {3}',
                selection.player,
                selection.title,
                supports.length > 0 ? supports : 'no one',
                rivals.length > 0 ? rivals : 'no one'
            );
        }
    }
}

export default TitlePool;
