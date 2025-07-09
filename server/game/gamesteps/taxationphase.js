import Phase from './phase.js';
import SimpleStep from './simplestep.js';
import DiscardToReservePrompt from './taxation/DiscardToReservePrompt.js';
import ActionWindow from './actionwindow.js';

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
            if (!player.doesNotReturnUnspentGold) {
                this.game.returnGoldToTreasury({ player: player, amount: player.gold });
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
