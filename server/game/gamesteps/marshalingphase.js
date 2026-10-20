import Phase from './phase.js';
import SimpleStep from './simplestep.js';
import MarshalingActionWindow from './marshaling/MarshalingActionWindow.js';

class MarshalingPhase extends Phase {
    constructor(game) {
        super(game, 'marshal');
        this.initialise([
            new SimpleStep(game, () => this.beginMarshal()),
            new SimpleStep(game, () => this.promptForMarshal())
        ]);
    }

    beginMarshal() {
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
    }

    promptForMarshal() {
        let currentPlayer = this.remainingPlayers.shift();

        this.collectIncome(currentPlayer);
        this.game.queueStep(new MarshalingActionWindow(this.game, currentPlayer));

        return this.remainingPlayers.length === 0;
    }

    collectIncome(player) {
        if (player.canGainGold()) {
            let gold = this.game.addGold(player, player.getIncome());
            this.game.addMessage('{0} collects {1} gold', player, gold);
        }

        this.game.raiseEvent('onIncomeCollected', { player: player });
    }
}

export default MarshalingPhase;
