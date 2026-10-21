import DrawCard from '../../drawcard.js';

class TheBlackCells extends DrawCard {
    // The Black Cells (13028)
    // Shadow (2).
    // Reaction: After a card you control comes out of shadows, kneel The Black Cells to choose an
    // opponent's character. Until the end of the phase, that character cannot kneel or stand.
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

export default TheBlackCells;
