const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');

class DominancePhase extends Phase {
    constructor(game) {
        super(game, 'dominance');
        this.initialise([
            new SimpleStep(game, () => this.determineWinner()),
            new ActionWindow(this.game, 'After dominance determined', 'dominance')
        ]);
    }

    determineWinner() {
        var dominanceWinner = undefined;
        var dominanceDifference = undefined;

        let playerDominance = this.game.getPlayersInFirstPlayerOrder().map(player => {
            return { player: player, dominance: player.getDominance(), winsTies: player.hasFlag('winsDominanceTies') };
        });
        var distinctSorted = [...new Set(playerDominance.map(p => p.dominance).sort((a, b) => b - a))];
        var potentialWinners = playerDominance.filter(p => p.dominance === distinctSorted[0]);

        var dominanceTied = potentialWinners.length > 1;
        potentialWinners = dominanceTied ? potentialWinners.filter(p => p.winsTies) : potentialWinners;

        if(potentialWinners.length === 1) {
            dominanceWinner = potentialWinners[0].player;
            dominanceDifference = distinctSorted[0] - (distinctSorted.length > 1 ? distinctSorted[1] : 0);
        }

        if(dominanceTied) {
            this.game.addMessage('There was a tie for dominance');
        }

        if(dominanceWinner) {
            //save the winner of dominance on the game object in order to use this information in determining the winner of the game after the time limit has expired
            this.game.winnerOfDominanceInLastRound = dominanceWinner;
            if(dominanceWinner.canGainFactionPower() && !dominanceWinner.hasFlag('cannotGainDominancePower')) {
                this.game.addMessage('{0} wins dominance ({1})', dominanceWinner, playerDominance.map(p => p.dominance).join(' vs '));
                this.game.addPower(dominanceWinner, 1);
            } else {
                this.game.addMessage('{0} wins dominance, but cannot gain power for their faction', dominanceWinner);
            }
        } else {
            this.game.addMessage('No one wins dominance');
        }

        this.game.raiseEvent('onDominanceDetermined', { winner: dominanceWinner, difference: dominanceDifference });
    }
}

module.exports = DominancePhase;
