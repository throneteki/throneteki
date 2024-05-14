const DrawCard = require('../../drawcard.js');

class KingsHuntingParty extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.anyOpponentHasKing(),
            match: this,
            effect: ability.effects.addIcon('intrigue')
        });
    }

    anyOpponentHasKing() {
        return this.game.anyCardsInPlay(
            (card) =>
                card.controller !== this.controller &&
                card.getType() === 'character' &&
                card.hasTrait('King')
        );
    }
}

KingsHuntingParty.code = '01055';

module.exports = KingsHuntingParty;
