const DrawCard = require('../../drawcard');

class OldBillBone extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            handler: (context) => {
                this.game.addMessage(
                    "{0} uses {1} to kneel each opponent's faction card",
                    context.player,
                    this
                );
                for (let opponent of this.game.getOpponents(context.player)) {
                    opponent.kneelCard(opponent.faction);
                }
            }
        });
    }
}

OldBillBone.code = '11097';

module.exports = OldBillBone;
