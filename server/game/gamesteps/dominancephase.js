const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const ChoosePlayerPrompt = require('./ChoosePlayerPrompt.js');
const GameActions = require('../GameActions/index.js');

class DominancePhase extends Phase {
    constructor(game) {
        super(game, 'dominance');
        this.initialise([
            new SimpleStep(game, () => this.determineDominance()),
            new ActionWindow(this.game, 'After dominance determined', 'dominance')
        ]);
    }

    determineDominance() {
        let result = { player: undefined, totalTied: false, difference: undefined };

        result.playerDominance = this.game.getPlayersInFirstPlayerOrder().map(player => {
            return { player: player, dominance: player.getDominance() };
        });
        var distinctSorted = [...new Set(result.playerDominance.map(p => p.dominance).sort((a, b) => b - a))];
        var potentialWinners = result.playerDominance.filter(p => p.dominance === distinctSorted[0]);

        result.totalTied = potentialWinners.length > 1;
        
        if(result.totalTied) {
            result.difference = 0;
            this.game.addMessage('There was a tie for dominance');
            let choosingPlayer = this.game.getPlayers().find(player => player.choosesWinnerForInitiativeTies);
            // If a player can choose winner for ties, prompt
            if(choosingPlayer) {
                let prompt = new ChoosePlayerPrompt(this.game, choosingPlayer, {
                    condition: player => potentialWinners.map(pw => pw.player).includes(player),
                    activePromptTitle: 'Choose player to win dominance',
                    waitingPromptTitle: 'Waiting for opponent to choose dominance winner',
                    onSelect: chosenPlayer => {
                        result.chosenBy = choosingPlayer;
                        result.player = chosenPlayer;

                        this.determineWinner(result);
                    },
                    onCancel: () => {
                        // Nobody wins dominance
                        this.determineWinner(result);
                    }
                });
        
                this.game.queueStep(prompt);
            }
            // Otherwise, nobody wins dominance
        } else {
            result.player = potentialWinners[0].player;
            result.difference = distinctSorted[0] - (distinctSorted.length > 1 ? distinctSorted[1] : 0);
            this.determineWinner(result);
        }
    }

    determineWinner(result) {
        let playerDominance = result.playerDominance.map(p => p.dominance);
        delete result.playerDominance;
        this.dominanceResult = result;

        this.game.raiseEvent('onDominanceDetermined', { winner: result.player, difference: result.difference, chosenBy: result.chosenBy }, event => {
            const comparisonString = playerDominance.join(' vs ');
            if(event.winner) {
                // Save the winner of dominance on the game object in order to use this information in determining the winner of the game after the time limit has expired
                this.game.winnerOfDominanceInLastRound = event.winner;

                const action = GameActions.gainPower({ card: event.winner.faction, amount: 1 });
                if(action.allow() && !event.winner.hasFlag('cannotGainDominancePower')) {
                    if(event.chosenBy) {
                        this.game.addMessage('{0} gains 1 power for their faction due to {1} choosing them to win dominance ({2})', event.winner, event.chosenBy, comparisonString);
                    } else {
                        this.game.addMessage('{0} gains 1 power for their faction for winning dominance ({1})', event.winner, comparisonString);
                    }
                    this.game.resolveGameAction(action);
                } else {
                    this.game.addMessage('{0} wins dominance, but cannot gain power for their faction ({1})', event.winner, comparisonString);
                }
            } else {
                this.game.addMessage('No one wins dominance ({0})', comparisonString);
            }
        });
    }
}

module.exports = DominancePhase;
