import DrawCard from '../../drawcard.js';

class GreatKrakensCrew extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.isDefending() &&
                    card.getType() === 'character' &&
                    card.hasPrintedCost() &&
                    card.getPrintedCost() <= 3
            },
            message:
                "{player} uses {source} to have {target} not contribute it's STR to this challenge",
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.doesNotContributeStrength()
                }));
            }
        });
    }
}

GreatKrakensCrew.code = '25063';

export default GreatKrakensCrew;
