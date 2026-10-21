import DrawCard from '../../drawcard.js';

class GreatKrakensCrew extends DrawCard {
    // Great Kraken's Crew (25063)
    // No attachments. Shadow (2).
    // Reaction: After Great Kraken's Crew comes out of shadows during a challenge, choose a
    // defending character with printed cost 3 or lower. That character does not contribute its STR
    // to this challenge.
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
