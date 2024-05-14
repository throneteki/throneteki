const DrawCard = require('../../drawcard');

class TheBlackCells extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller !== context.player
            },
            message: '{player} kneels {source} to prevent {target} from standing or kneeling',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [ability.effects.cannotBeStood(), ability.effects.cannotBeKneeled()]
                }));
            }
        });
    }
}

TheBlackCells.code = '13028';

module.exports = TheBlackCells;
