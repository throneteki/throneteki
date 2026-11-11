import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SchemingSnake extends DrawCard {
    // Scheming Snake (25007)
    // Shadow (2).
    // Reaction: After Scheming Snake enters play during a challenge, choose a participating
    // character with fewer than 2 challenge icons. That character does not contribute its STR to
    // this challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.isParticipating() &&
                    card.getType() === 'character' &&
                    card.getNumberOfIcons() < 2
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

SchemingSnake.code = '25007';

export default SchemingSnake;
