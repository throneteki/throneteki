const DrawCard = require('../../../drawcard.js');

class ThereAreNoMenLikeMe extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: "Select character that doesn't kneel for military challenges",
            target: {
                activePromptTitle: 'Select a Knight character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('knight')
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    condition: () => (
                        this.game.currentChallenge &&
                        this.game.currentChallenge.challengeType === 'military'
                    ),
                    effect: [
                        ability.effects.doesNotKneelAsAttacker(),
                        ability.effects.doesNotKneelAsDefender()
                    ]
                }));

                this.game.addMessage('{0} uses {1} to keep {2} standing when participating in military challenges this phase.', context.player, this, context.target);
            }
        });
    }
}

ThereAreNoMenLikeMe.code = '07030';

module.exports = ThereAreNoMenLikeMe;
