import AllPlayerPrompt from '../allplayerprompt.js';
import GameActions from '../../GameActions/index.js';

class SetupCardsPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.setup;
    }

    activePrompt(player) {
        const problem = this.getProblem(player);
        return {
            menuTitle: 'Select setup cards',
            promptTitle: problem,
            buttons: [{ arg: 'setupdone', text: 'Done', disabled: !!problem }]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to finish setup' };
    }

    getProblem(player) {
        if (this.game.manualMode.enabled) {
            return undefined;
        }

        if (player.getSetupPlacement().cost > player.setupGold) {
            return `Setup cards cost more than ${player.setupGold} gold`;
        }

        const [attachment] = player.getSetupAttachmentsWithoutTarget();
        if (attachment) {
            return `${attachment.name} has no card to attach to`;
        }

        return undefined;
    }

    onCardClicked(player, card) {
        if (player.setup || card.controller !== player || !player.getSetupCards().includes(card)) {
            return false;
        }

        this.game.resolveGameAction(GameActions.returnCardToHand({ card }));
        return true;
    }

    onMenuCommand(player) {
        if (player.setup || this.getProblem(player)) {
            return false;
        }

        player.setup = true;
        this.game.spendGold({
            amount: player.getSetupPlacement().cost,
            player,
            activePlayer: player,
            playingType: 'setup'
        });
        this.game.addMessage('{0} has finished setup', player);
    }
}

export default SetupCardsPrompt;
