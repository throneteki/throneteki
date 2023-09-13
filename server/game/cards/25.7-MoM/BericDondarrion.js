const DrawCard = require('../../drawcard.js');

class BericDondarrion extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isAttacking()
            },
            target: {
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' && card.controller === context.event.challenge.loser
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to prevent {target} from standing or kneeling until the end of the round',
            handler: context => {
                this.untilEndOfRound(ability => ({
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
