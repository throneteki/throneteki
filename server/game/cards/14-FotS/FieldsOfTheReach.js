import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class FieldsOfTheReach extends DrawCard {
    // Fields of the Reach (14038)
    // Reaction: After you win a [power] challenge, kneel 3 The Reach locations to raise the claim
    // value on your revealed plot card by 1 until the end of the challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        challengeType: 'power'
                    })
            },
            cost: ability.costs.kneelMultiple(
                3,
                (card) => card.getType() === 'location' && card.hasTrait('The Reach')
            ),
            message: {
                format: '{player} uses {source} and kneels {kneeledCards} to raise their claim by 1',
                args: { kneeledCards: (context) => context.costs.kneel }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: (card) => card === context.player.activePlot,
                effect: ability.effects.modifyClaim(1)
            }))
        });
    }
}

FieldsOfTheReach.code = '14038';

export default FieldsOfTheReach;
