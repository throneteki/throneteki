const DrawCard = require('../../drawcard.js');

class BericDondarrion extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isAttacking()
            },
            target: {
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' && card.controller === context.challenge.loser
            },
            message: '{player} uses {source} to prevent {target} from standing or kneeling',
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.cannotBeStood(),
                        ability.effects.cannotBeKneeled()
                    ]
                }));
            }
        });
    }
}

BericDondarrion.code = '25501';
BericDondarrion.version = '1.0';

module.exports = BericDondarrion;
