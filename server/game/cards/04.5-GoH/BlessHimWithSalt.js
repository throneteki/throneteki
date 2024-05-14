const DrawCard = require('../../drawcard.js');

class BlessHimWithSalt extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give +3 STR to character',
            condition: () => this.game.isDuringChallenge({ challengeType: 'power' }),
            target: {
                activePromptTitle: 'Select character',
                cardCondition: (card) =>
                    card.isParticipating() &&
                    (card.hasTrait('Drowned God') || card.hasTrait('Ironborn'))
            },
            handler: (context) => {
                this.selectedCard = context.target;
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(3)
                }));
                this.game.once('afterChallenge', this.afterChallenge.bind(this));

                this.game.addMessage(
                    '{0} uses {1} to give +3 STR to {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    afterChallenge(event) {
        if (!this.selectedCard) {
            return;
        }

        if (event.challenge.winner === this.controller && this.controller.canDraw()) {
            this.controller.drawCardsToHand(1);

            this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
        }

        this.selectedCard = undefined;
    }
}

BlessHimWithSalt.code = '04092';

module.exports = BlessHimWithSalt;
