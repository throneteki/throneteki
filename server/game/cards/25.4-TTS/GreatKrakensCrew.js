import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class GreatKrakensCrew extends DrawCard {
    // Great Kraken's Crew (25063)
    // No attachments. Shadow (2).
    // Reaction: After Great Kraken's Crew comes out of shadows during a challenge, choose a
    // defending character with printed cost 3 or lower. That character does not contribute its STR
    // to this challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
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
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.doesNotContributeStrength()
            }))
        });
    }
}

GreatKrakensCrew.code = '25063';

export default GreatKrakensCrew;
