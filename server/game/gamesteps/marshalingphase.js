const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const MarshalCardsPrompt = require('./marshaling/marshalcardsprompt.js');

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

        currentPlayer.allowMarshal = true;
        this.game.queueStep(new MarshalCardsPrompt(this.game, currentPlayer));
        this.game.queueSimpleStep(() => {
            currentPlayer.allowMarshal = false;
        });

        return this.remainingPlayers.length === 0;
    }

    collectIncome(player) {
        if (player.canGainGold()) {
            let gold = this.game.addGold(player, player.getTotalIncome());
            this.game.addMessage('{0} collects {1} gold', player, gold);
        }

        this.game.raiseEvent('onIncomeCollected', { player: player });
    }
}

module.exports = MarshalingPhase;
