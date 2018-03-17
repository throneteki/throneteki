const DrawCard = require('../../drawcard.js');

class Darkstar extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return each participating character to hand',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this) &&
                             this.game.currentChallenge.getNumberOfParticipants() > 1,
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                let participants = this.game.currentChallenge.getParticipants();

                for(let card of participants) {
                    card.owner.returnCardToHand(card);
                }

                this.game.addMessage('{0} sacrifices {1} to return {2} to its owner\'s hand',
                    context.player, this, participants);
            }
        });
    }
}

Darkstar.code = '10004';

module.exports = Darkstar;
