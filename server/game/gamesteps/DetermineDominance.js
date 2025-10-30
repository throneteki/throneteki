import { Flags } from '../Constants/Flags.js';
import GameActions from '../GameActions/index.js';
import BaseStep from './basestep.js';
import ChoosePlayerPrompt from './ChoosePlayerPrompt.js';

class DetermineDominance extends BaseStep {
    constructor(game, reason) {
        super(game);
        this.reason = reason;
    }

    continue() {
        const result = { player: undefined, totalTied: false, difference: undefined };

        result.playerDominance = this.game.getPlayersInFirstPlayerOrder().map((player) => {
            return { player: player, dominance: player.getDominance() };
        });
        const distinctSorted = [
            ...new Set(result.playerDominance.map((p) => p.dominance).sort((a, b) => b - a))
        ];
        const potentialWinners = result.playerDominance.filter(
            (p) => p.dominance === distinctSorted[0]
        );
        for (const playerDominance of result.playerDominance) {
            this.game.addMessage(
                '{0} has {1} for dominance',
                playerDominance.player,
                playerDominance.dominance
            );
        }

        result.totalTied = potentialWinners.length > 1;

        if (result.totalTied) {
            result.difference = 0;
            this.game.addMessage('There was a tie for dominance');
            const choosingPlayer = this.game
                .getPlayers()
                .find((player) => player.choosesWinnerForDominanceTies);
            if (choosingPlayer) {
                // If a player can choose winner for ties, prompt
                const prompt = new ChoosePlayerPrompt(this.game, choosingPlayer, {
                    condition: (player) => potentialWinners.map((pw) => pw.player).includes(player),
                    activePromptTitle: 'Choose player to win dominance',
                    waitingPromptTitle: 'Waiting for opponent to choose dominance winner',
                    onSelect: (chosenPlayer) => {
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
            } else {
                // Otherwise, nobody wins dominance
                this.determineWinner(result);
            }
        } else if (potentialWinners.length > 0) {
            result.player = potentialWinners[0].player;
            result.difference =
                distinctSorted[0] - (distinctSorted.length > 1 ? distinctSorted[1] : 0);
            this.determineWinner(result);
        }
        return true;
    }

    determineWinner(result) {
        this.game.raiseEvent(
            'onDominanceDetermined',
            { winner: result.player, difference: result.difference, chosenBy: result.chosenBy },
            (event) => {
                if (event.winner) {
                    if (this.reason === 'dominance phase') {
                        // Save the winner of dominance on the game object in order to use this information in determining the winner of the game after the time limit has expired
                        this.game.winnerOfDominanceInLastRound = event.winner;
                    }

                    const action = GameActions.gainPower({ card: event.winner.faction, amount: 1 });
                    if (
                        action.allow() &&
                        !event.winner.hasFlag(Flags.player.cannotGainDominancePower)
                    ) {
                        if (event.chosenBy) {
                            this.game.addMessage(
                                '{0} gains 1 power for their faction due to {1} choosing them to win dominance',
                                event.winner,
                                event.chosenBy
                            );
                        } else {
                            this.game.addMessage(
                                '{0} gains 1 power for their faction for winning dominance',
                                event.winner
                            );
                        }
                        this.game.resolveGameAction(action);
                    } else {
                        this.game.addMessage(
                            '{0} wins dominance, but cannot gain power for their faction',
                            event.winner
                        );
                    }
                } else {
                    this.game.addMessage('No one wins dominance');
                }
            }
        );
    }
}

export default DetermineDominance;
