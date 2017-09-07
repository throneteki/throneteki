const DrawCard = require('../../drawcard.js');

class ForTheNorth extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give +2 STR to character',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'military',
            target: {
                cardCondition: card => this.game.currentChallenge.isParticipating(card) && card.isFaction('stark')
            },
            handler: context => {
                this.selectedCard = context.target;
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }));
                this.game.once('afterChallenge', this.afterChallenge.bind(this));

                this.game.addMessage('{0} plays {1} to give +2 STR to {2} until the end of the challenge', context.player, this, context.target);
            }
        });
    }

    afterChallenge(event) {
        if(!this.selectedCard) {
            return;
        }

        if(event.challenge.winner === this.controller) {
            this.controller.drawCardsToHand(1);

            this.game.addMessage('{0} draws 1 card because of {1}', this.controller, this);
        }

        this.selectedCard = undefined;
    }
}

ForTheNorth.code = '01157';

module.exports = ForTheNorth;
