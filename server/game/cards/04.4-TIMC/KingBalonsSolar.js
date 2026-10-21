import DrawCard from '../../drawcard.js';

class KingBalonsSolar extends DrawCard {
    // King Balon's Solar (04072)
    // Reaction: After you win initiative, gain 1 gold.
    setupCardAbilities() {
        this.reaction({
            when: {
                onInitiativeDetermined: (event) =>
                    event.winner === this.controller && this.controller.canGainGold()
            },
            handler: (context) => {
                this.game.addGold(context.player, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', context.player, this);
            }
        });
    }
}

KingBalonsSolar.code = '04072';

export default KingBalonsSolar;
