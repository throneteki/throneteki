import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheKrakensGrasp extends DrawCard {
    // The Kraken's Grasp (01082)
    // Play only if you are the first player.
    // Challenges Action: Choose a defending character with STR 5 or lower. That character does not
    // contribute is STR to this challenge.
    setupCardAbilities(ability) {
        this.action({
            title: "Remove character's strength",
            condition: (context) => context.source.controller.firstPlayer,
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isDefending() &&
                    card.getStrength() <= 5
            },
            message: "{player} plays {source} to remove {target}' STR from the challenge",
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.doesNotContributeStrength()
            }))
        });
    }
}

TheKrakensGrasp.code = '01082';

export default TheKrakensGrasp;
