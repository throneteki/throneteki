import DrawCard from '../../drawcard.js';

class Rhaegal extends DrawCard {
    // Rhaegal (11073)
    // Ambush (5). No attachments.
    // Reaction: After an opponent's character is killed by a card effect, stand Rhaegal.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    !this.game.claim.isApplying &&
                    event.card.controller !== this.controller &&
                    this.kneeled
            },
            handler: (context) => {
                context.player.standCard(this);
                this.game.addMessage('{0} stands {1}', context.player, this);
            }
        });
    }
}

Rhaegal.code = '11073';

export default Rhaegal;
