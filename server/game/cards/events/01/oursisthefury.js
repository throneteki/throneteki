const DrawCard = require('../../../drawcard.js');

class OursIsTheFury extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add knelt Baratheon as defender',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.defendingPlayer === this.controller,
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.kneeled && card.controller === this.controller &&
                                       card.isFaction('baratheon') && card.canParticipateInChallenge()
            },
            handler: context => {
                this.selectedCard = context.target;
                this.game.currentChallenge.addDefender(context.target);
                this.game.addMessage('{0} plays {1} to add {2} to the challenge as a defender', context.player, this, context.target);

                this.game.once('afterChallenge', this.afterChallenge.bind(this));
            }
        });
    }

    afterChallenge(event) {
        if(!this.selectedCard) {
            return;
        }

        if(event.challenge.winner === this.controller) {
            this.controller.standCard(this.selectedCard);
            this.game.addMessage('{0} uses {1} to stand {2}', this.controller, this, this.selectedCard);
        }

        this.selectedCard = undefined;
    }
}

OursIsTheFury.code = '01063';

module.exports = OursIsTheFury;
