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
        var highestDominance = 0;
        var lowestDominance = 0;
        var dominanceWinner = undefined;

        for(let player of this.game.getPlayers()) {
            var dominance = player.getDominance();

            lowestDominance = dominance;

            if(dominance === highestDominance) {
                dominanceWinner = undefined;
            }

            if(dominance > highestDominance) {
                lowestDominance = highestDominance;
                highestDominance = dominance;
                dominanceWinner = player;
            } else {
                lowestDominance = dominance;
            }
        }

        if(dominanceWinner) {
            //save the winner of dominance on the game object in order to use this information in determining the winner of the game after the time limit has expired
            this.game.winnerOfDominanceInLastRound = dominanceWinner;
            if(dominanceWinner.canGainFactionPower() && !dominanceWinner.hasFlag('cannotGainDominancePower')) {
                this.game.addMessage('{0} wins dominance ({1} vs {2})', dominanceWinner, highestDominance, lowestDominance);
                this.game.addPower(dominanceWinner, 1);
            } else {
                this.game.addMessage('{0} wins dominance, but cannot gain power for their faction', dominanceWinner);
            }
        } else {
            this.game.addMessage('There was a tie for dominance');
            this.game.addMessage('No one wins dominance');
        }

        this.game.raiseEvent('onDominanceDetermined', { winner: dominanceWinner });
    }
}

module.exports = DominancePhase;
