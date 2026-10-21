import DrawCard from '../../drawcard.js';

class FieldsOfTheReach extends DrawCard {
    // Fields of the Reach (14038)
    // Reaction: After you win a [power] challenge, kneel 3 The Reach locations to raise the claim
    // value on your revealed plot card by 1 until the end of the challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, challengeType: 'power' })
            },
            cost: ability.costs.kneelMultiple(
                3,
                (card) => card.getType() === 'location' && card.hasTrait('The Reach')
            ),
            message: {
                format: '{player} uses {source} and kneels {kneeledCards} to raise their claim by 1',
                args: { kneeledCards: (context) => context.costs.kneel }
            },
            handler: () => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }
}

FieldsOfTheReach.code = '14038';

export default FieldsOfTheReach;
