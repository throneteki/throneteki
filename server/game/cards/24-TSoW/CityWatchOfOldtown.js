const DrawCard = require('../../drawcard.js');

class CityWatchOfOldtown extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardRevealed: event => ['hand', 'draw deck', 'shadows'].includes(event.card.location) && event.card.controller === this.controller
            },
            message: '{player} uses {source} to give {source} +1 STR until the end of the phase',
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    match: this,
                    effect: ability.effects.modifyStrength(1)
                }));
            }
        });
    }
}

CityWatchOfOldtown.code = '24023';

module.exports = CityWatchOfOldtown;
