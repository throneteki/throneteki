const DrawCard = require('../../drawcard.js');

class OldtownCityWatch extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardRevealed: event => ['hand', 'draw deck', 'shadows'].includes(event.card.location) && event.card.controller === this.controller
            },
            message: '{player} uses {source} to ensure that {source} cannot be stealth until the end of the phase',
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    match: this,
                    effect: ability.effects.cannotBeBypassedByStealth()
                }));
            }
        });
    }
}

OldtownCityWatch.code = '24023';

module.exports = OldtownCityWatch;
