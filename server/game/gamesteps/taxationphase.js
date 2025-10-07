import Phase from './phase.js';
import SimpleStep from './simplestep.js';
import DiscardToReservePrompt from './taxation/DiscardToReservePrompt.js';
import ActionWindow from './actionwindow.js';
import { Flags } from '../Constants/index.js';

class TaxationPhase extends Phase {
    constructor(game) {
        super(game, 'taxation');
        this.initialise([
            new SimpleStep(game, () => this.returnGold()),
            () => new DiscardToReservePrompt(game),
            new SimpleStep(game, () => this.returnTitleCards()),
            new ActionWindow(game, 'After reserve check', 'taxation')
        ]);
    }

    returnGold() {
        for (const player of this.game.getPlayersInFirstPlayerOrder()) {
            const amountToReturn = !player.hasFlag(Flags.player.doesNotReturnUnspentGold)
                ? Math.max(0, player.gold - player.amountUnspentGoldToKeep)
                : 0;
            const amountToKeep = player.gold - amountToReturn;
            if (amountToKeep > 0) {
                this.game.addMessage(
                    '{0} keeps {1} unspent gold, and returns {2} to the treasury',
                    player,
                    amountToKeep,
                    amountToReturn > 0 ? amountToReturn : 'none'
                );
            } else if (amountToReturn > 0) {
                this.game.addMessage(
                    '{0} returns {1} unspent gold to the treasury',
                    player,
                    amountToReturn
                );
            } else {
                this.game.addMessage('{0} has no unspent gold to return to the treasury', player);
            }
            if (amountToReturn > 0) {
                this.game.returnGoldToTreasury({ player: player, amount: amountToReturn });
            }
        }
    }

    returnTitleCards() {
        if (!this.game.isMelee) {
            return;
        }

        for (const player of this.game.getPlayers()) {
            this.game.titlePool.returnToPool(player, player.title);
        }
    }
}

export default TaxationPhase;
