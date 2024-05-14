import DrawCard from '../../drawcard.js';

class Patience extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ controller: 'current' });
        this.action({
            title: 'Return parent to hand',
            phase: 'challenge',
            handler: (context) => {
                this.parent.owner.returnCardToHand(this.parent);
                this.game.addMessage(
                    "{0} uses {1} to return {2} to {3}'s hand",
                    context.player,
                    this,
                    this.parent,
                    this.parent.owner
                );
            }
        });
    }
}

Patience.code = '10020';

export default Patience;
