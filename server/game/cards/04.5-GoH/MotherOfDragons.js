const DrawCard = require('../../drawcard.js');

class MotherOfDragons extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Stormborn' });
        this.action({
            title: 'Add attached character to the challenge',
            condition: () => this.game.currentChallenge && this.parent.canParticipateInChallenge() &&
                             this.controller.anyCardsInPlay(card => this.game.currentChallenge.isParticipating(card) && card.hasTrait('Dragon')),
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let challenge = this.game.currentChallenge;

                if(challenge.attackingPlayer === this.controller) {
                    challenge.addAttacker(this.parent);
                } else {
                    challenge.addDefender(this.parent);
                }
                this.game.addMessage('{0} kneels {1} to have {2} participate in the challenge on their side', this.controller, this, this.parent);
            }
        });
    }
}

MotherOfDragons.code = '04094';

module.exports = MotherOfDragons;
