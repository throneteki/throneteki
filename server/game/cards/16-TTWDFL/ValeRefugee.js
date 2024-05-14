import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ValeRefugee extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onDominanceDetermined: (event) => event.winner !== this.controller
            },
            handler: (context) => {
                if (context.player.getSpendableGold() < 2) {
                    this.handleDiscard(context.player);
                } else {
                    this.promptForDiscard(context);
                }
            }
        });
    }

    promptForDiscard(context) {
        this.game.promptWithMenu(context.player, this, {
            activePrompt: {
                menuTitle: 'Pay 2 gold?',
                buttons: [
                    { text: 'Yes', method: 'handlePayGold' },
                    { text: 'No', method: 'handleDiscard' }
                ]
            },
            source: this
        });
    }

    handlePayGold(player) {
        this.game.addMessage('{player} is forced to pay 2 gold to keep {source} in play', {
            player,
            source: this
        });
        this.game.spendGold({ amount: 2, player });
        return true;
    }

    handleDiscard(player) {
        this.game.addMessage('{player} is forced to discard {source}', { player, source: this });
        this.game.resolveGameAction(GameActions.discardCard({ card: this }));
        return true;
    }
}

ValeRefugee.code = '16018';

export default ValeRefugee;
