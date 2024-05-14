const DrawCard = require('../../drawcard');

class FieldsOfTheReach extends DrawCard {
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

module.exports = FieldsOfTheReach;
