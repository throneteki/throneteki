const DrawCard = require('../../drawcard.js');

class LegacyOfTheWatch extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', faction: 'thenightswatch', controller: 'current', unique: true });
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.lookAtBottomCard(() => this.game.getOpponents(this.controller))
        });
        this.persistentEffect({
            targetController: 'current',
            effect: [
                ability.effects.canMarshal(card => this.isBottomCard(card)),
                ability.effects.canPlay(card => this.isBottomCard(card))
            ]
        });
    }

    isBottomCard(card) {
        return (
            card.controller !== this.controller &&
            card.location === 'draw deck' &&
            card === card.controller.drawDeck[card.controller.drawDeck.length - 1] &&
            card.getType() === 'character'
        );
    }
}

LegacyOfTheWatch.code = '25557';
LegacyOfTheWatch.version = '1.1';

module.exports = LegacyOfTheWatch;
