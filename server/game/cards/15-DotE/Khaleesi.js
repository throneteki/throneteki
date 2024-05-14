const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Khaleesi extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isParticipating(this.parent)
            },
            cost: ability.costs.kneelSelf(),
            choices: {
                'Stand attached character': () => {
                    if (this.parent.allowGameAction('stand')) {
                        this.game.resolveGameAction(GameActions.standCard({ card: this.parent }));
                        this.game.addMessage(
                            '{0} kneels {1} to stand {2}',
                            this.controller,
                            this,
                            this.parent
                        );
                    }
                },
                'Raise claim': () => {
                    this.untilEndOfChallenge((ability) => ({
                        match: (card) => card === this.controller.activePlot,
                        effect: ability.effects.modifyClaim(1)
                    }));

                    this.game.addMessage(
                        '{0} kneels {1} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                        this.controller,
                        this
                    );
                }
            }
        });
    }
}

Khaleesi.code = '15019';

module.exports = Khaleesi;
