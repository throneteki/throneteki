const DrawCard = require('../../drawcard.js');

class KnightsOfTheMind extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give each Maester character you control a military icon',
            handler: () => {
                this.game.addMessage(
                    '{0} plays {1} to give each Maester character a military icon until the end of the phase',
                    this.controller,
                    this
                );
                let maesters = this.controller.filterCardsInPlay(
                    (card) => card.getType() === 'character' && card.hasTrait('Maester')
                );
                this.untilEndOfPhase((ability) => ({
                    match: maesters,
                    effect: ability.effects.addIcon('military')
                }));
            }
        });
    }
}

KnightsOfTheMind.code = '13078';

module.exports = KnightsOfTheMind;
