import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BurningOnTheSand extends DrawCard {
    // Burning on the Sand (04076)
    // Reaction: After you lose an unopposed challenge, set the claim value on the winning
    // opponent's revealed plot card to 0 until the end of the challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.isUnopposed()
            },
            message: {
                format: "{player} plays {source} to set the claim value on {opponent}'s revealed plot card to 0 until the end of the challenge",
                args: { opponent: (context) => context.event.challenge.winner }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: (card) => card === card.controller.activePlot,
                targetController: context.event.challenge.winner,
                effect: ability.effects.setClaim(0)
            }))
        });
    }
}

BurningOnTheSand.code = '04076';

export default BurningOnTheSand;
