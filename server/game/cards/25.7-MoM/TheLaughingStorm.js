const DrawCard = require('../../drawcard.js');

class TheLaughingStorm extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', faction: 'baratheon', controller: 'current', unique: true });
        this.persistentEffect({
            condition: () => this.eachOpponentHasFewerStandingCharacters(),
            targetLocation: 'hand',
            effect: ability.effects.cannotBeDiscarded()
        });
    }

    eachOpponentHasFewerStandingCharacters() {
        return this.game.getOpponents(this.controller).every(opponent => opponent.getNumberOfCardsInPlay({ type: 'character', kneeled: false }) < this.controller.getNumberOfCardsInPlay({ type: 'character', kneeled: false }));
    }
}

TheLaughingStorm.code = '25509';
TheLaughingStorm.version = '1.1';

module.exports = TheLaughingStorm;
