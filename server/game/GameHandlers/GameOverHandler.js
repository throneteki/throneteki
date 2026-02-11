import GameActions from '../GameActions/index.js';
import TextHelper from '../TextHelper.js';

class GameOverHandler {
    constructor(game) {
        this.game = game;
        this.eliminated = [];
        this.isGameOver = false;
    }

    /**
     * Checks various conditions which could trigger game over:
     * - Victory condition: Player(s) reach 15 power
     * - Empty Draw Deck: Player(s) with no cards left in their draw deck are eliminated
     */
    checkConditions() {
        if (this.game.currentPhase === 'setup' || this.isGameOver || this.game.disableWinning) {
            return;
        }
        let actions = [];
        const firstPlayer = this.game.getFirstPlayer();
        const remainingPlayers = this.game.getPlayersInFirstPlayerOrder();

        // Collect players with empty draw deck
        const emptyDrawDeck = remainingPlayers.filter((player) => player.drawDeck.length === 0);
        if (emptyDrawDeck.length > 0) {
            this.game.addAlert(
                'info',
                '{0} {1} run out of cards in their draw deck',
                emptyDrawDeck,
                emptyDrawDeck.length > 1 ? 'have' : 'has'
            );
            actions.push(
                ...emptyDrawDeck.map((player) => ({
                    player,
                    type: 'eliminate',
                    text: `${player.name} is eliminated`,
                    handler: (player) => this.eliminate(player, 'decked')
                }))
            );
        }

        // Collect players who have reached their victory conditions
        const potentialWinners = remainingPlayers.filter(
            (player) => player.getTotalPower() >= 15 && player.canWinGame()
        );
        if (potentialWinners.length > 0) {
            this.game.addAlert(
                'info',
                '{0} {1} reached 15 power',
                potentialWinners,
                potentialWinners.length > 1 ? 'have' : 'has'
            );
            actions.push(
                ...potentialWinners.map((player) => ({
                    player,
                    type: 'win',
                    text: `${player.name} wins`,
                    handler: (player) => this.gameOver('power', player)
                }))
            );
        }

        // Process actions simultaneously, with First Player choosing order
        if (actions.length > 0) {
            this.processActions(firstPlayer, actions);
        }
    }

    processActions(firstPlayer, actions) {
        if (this.isGameOver) {
            return;
        }

        // Create function to process a chosen action
        const processFunc = (action) => {
            action.handler(action.player);
            // Remove any actions for this player, as you can never do multiple per person
            actions = actions.filter((a) => a.player !== action.player);
        };

        const context = {
            selectAction: (player, actionIndex) => {
                const action = actions[actionIndex];
                processFunc(action);
                this.processActions(firstPlayer, actions);
            }
        };

        if (actions.length === 1) {
            processFunc(actions[0]);
        } else if (actions.length > 1) {
            this.game.promptWithMenu(firstPlayer, context, {
                activePrompt: {
                    menuTitle: 'Select next action',
                    buttons: actions.map((action, index) => ({
                        arg: index,
                        text: action.text,
                        method: 'selectAction'
                    }))
                },
                waitingPromptTitle: `Waiting for ${firstPlayer.name} to choose order`,
                source: this
            });
        } else {
            this.checkGameContinue();
        }
        return;
    }

    gameTimeLimitExpired() {
        this.game.addAlert(
            'warning',
            'Time is up. The game will end after the current round has finished'
        );
        // Trigger before the next round starts
        this.game.on('onBeginRound', () => {
            // Fetch all remaining players who can win
            // Players who cannot win will be ranked after game is over based on total power
            const remainingPlayers = this.game.getPlayers().filter((player) => player.canWinGame());
            const highestPower = Math.max(
                ...remainingPlayers.map((player) => player.getTotalPower())
            );
            let winners = remainingPlayers.filter(
                (player) => player.getTotalPower() === highestPower
            );

            // If there are multiple winners, determine if tie breaks are required
            if (winners.length > 0) {
                winners = this.game.allowMultipleWinners ? winners : this.breakTie(winners);
            }

            this.gameOver('time', ...winners);
        });
    }

    playerChessClockExpired(player) {
        if (!player.eliminated) {
            this.game.addAlert('info', "{0}'s chess clock has run out", player);
            this.eliminate(player, 'time');
        }
    }

    playerConceded(player) {
        if (!player.eliminated) {
            this.game.addAlert('info', '{0} concedes', player);
            this.eliminate(player, 'concede');
        }
    }

    playerLeft(player) {
        if (this.game.canSafelyLeave(player)) {
            this.gameOver();
        } else if (!player.eliminated) {
            this.eliminate(player, 'left');
        }
    }

    playerDisconnected(player) {
        if (!player.eliminated) {
            this.game.addAlert('info', '{0} has been eliminated', player);
            this.eliminate(player, 'disconnected');
        }
    }

    eliminate(player, reason) {
        if (player.eliminated) {
            return;
        }
        // Set standing to number of remaining players
        player.standing = this.game.getNumberOfPlayers();
        player.setPrompt({
            menuTitle: 'You have been eliminated'
        });

        this.eliminated.push({ player, reason });
        player.eliminated = true;
        player.eliminatedReason = reason;
        player.setIsActivePrompt(false);
        this.game.emit('onPlayerEliminated', { player, reason });

        // Certain processes only happen if the game continues
        if (this.checkGameContinue(reason)) {
            // Remove cards they own from the game
            const removeFromGame = this.game.filterCardsInPlay((card) => card.owner === player);
            // Discard cards they control (but do not own)
            const discardFromPlay = this.game.filterCardsInPlay(
                (card) => card.controller === player && card.owner !== player
            );
            if (removeFromGame.length > 0) {
                this.game.addMessage('{0} removes {1} from the game', player, removeFromGame);
            }
            if (discardFromPlay.length > 0) {
                this.game.addMessage('{0} discards {1} from play', player, discardFromPlay);
            }
            this.game.resolveGameAction(
                GameActions.simultaneously([
                    ...removeFromGame.map((card) => GameActions.removeFromGame({ card })),
                    ...discardFromPlay.map((card) => GameActions.discardCard({ card }))
                ])
            );

            // Pass first player if they were it
            if (player.firstPlayer) {
                const playerToLeft = this.game.getPlayerToLeftOf(player);
                this.game.addMessage('{0} has become the first player', playerToLeft);
                this.game.setFirstPlayer(playerToLeft);
            }
        }
    }

    /**
     * Checks if the game should continue based on remaining players. Also handles
     * scenarios where the remaining player cannot win, resulting in "nobody winning"
     * @param {string} reason the reason for the check, such as if an opponent conceeded; used to save the "game over" reason
     * @returns true if the game should continue, false if the game is over
     */
    checkGameContinue(reason) {
        const remainingPlayers = this.game.getPlayers();
        if (remainingPlayers.length <= 1) {
            const [player] = remainingPlayers;
            // Player cannot be blocked from winning if final opponent concedes
            if (player && (player.canWinGame() || reason === 'concede')) {
                // If the game over trigger was the final opponent conceding, then reason is 'concede'
                this.gameOver(reason === 'concede' ? reason : 'remaining', player);
            } else {
                this.gameOver();
            }
            return false;
        }
        return true;
    }

    /**
     * Trigger the game over sequence
     * @param {string} reason the reason for the game over trigger (eg. opponent conceding)
     * @param  {...Player} winners the players who have won the game (if multiple players can win the game)
     */
    gameOver(reason = 'draw', ...winners) {
        if (this.isGameOver) {
            return;
        }
        const finishedAt = new Date();
        this.isGameOver = true;

        if (winners.length === 0) {
            this.game.addAlert('info', 'Nobody wins the game');
            // Important: Each player detail will not contain "standing" if all players lose/draw
            this.game.recordResults([{ name: 'DRAW' }], reason, finishedAt);
        } else {
            const standings = {};

            // 1. Apply winners to standings
            let nextStanding = 1;
            standings[nextStanding] = winners;
            nextStanding += winners.length;

            // 2.a Apply remaining (non-eliminated) players to standings, based on total power
            const remainingPlayers = this.game
                .getPlayers()
                .filter((player) => !winners.some((winner) => winner.name === player.name));
            const powerGroups = remainingPlayers.reduce((groups, player) => {
                const powerTotal = player.getTotalPower();
                const group = groups[powerTotal] || [];
                group.push(player);
                groups[powerTotal] = group;
                return groups;
            }, {});
            // 2.b Loop through power totals, highest first, and apply standings to all on that total
            for (const powerTotal of Object.keys(powerGroups).sort((a, b) => b - a)) {
                const players = powerGroups[powerTotal];
                standings[nextStanding] = players;
                // Ensures next standing is accurate if there were multiple players here
                // eg. One player in 1st, two players tied for 2nd, then next standing should be 4th
                nextStanding += players.length;
            }

            // 3. Apply eliminated players to standings, based on order of elimination
            for (const { player } of this.eliminated.reverse()) {
                standings[nextStanding++] = [player];
            }

            // Announce results & append standing to detail
            for (const [standing, players] of Object.entries(standings)) {
                if (standing === '1') {
                    this.game.addAlert('success', '{0} has won the game', players);
                } else if (this.game.isMelee) {
                    this.game.addAlert(
                        'info',
                        '{0} placed {1}',
                        players,
                        TextHelper.ordinal(standing)
                    );
                }

                for (const player of players) {
                    player.standing = parseInt(standing);
                }
            }

            this.game.emit('onGameOver', { winners, reason, finishedAt, standings });
            this.game.recordResults(winners, reason, finishedAt);
        }
    }

    breakTie(players) {
        const highestPowerTotal = (players) => {
            const highest = Math.max(...players.map((player) => player.getTotalPower()));
            return players.filter((player) => player.getTotalPower() === highest);
        };
        const mostCardsInDrawDeck = (players) => {
            const most = Math.max(...players.map((player) => player.drawDeck.length));
            return players.filter((player) => player.drawDeck.length === most);
        };
        const wonLastDominance = (players) => {
            const winner = this.game.winnerOfDominanceInLastRound;
            const remaining = players.filter((player) => player.name === winner?.name);
            // If there are no players here, then either both tied or lost dominance
            return remaining.length > 0 ? remaining : players;
        };
        const fewerDeadCharacters = (players) => {
            const fewest = Math.min(...players.map((player) => player.deadPile.length));
            return players.filter((player) => player.deadPile.length === fewest);
        };
        const closestToFirstPlayer = (players) => {
            // Loop through players, starting with first, and return the first winner matched
            // Note: We look at "closest" to first to account for the rare scenario of a melee tie
            //       where the first player isn't in the tie breaker. This is a community ruling, as
            //       FFG technically had no ruling to account for this scenario!
            for (const player of this.game.getPlayersInFirstPlayerOrder()) {
                if (players.some((p) => p === player)) {
                    return [player];
                }
            }
            return [];
        };

        const breakers = [
            highestPowerTotal,
            mostCardsInDrawDeck,
            wonLastDominance,
            fewerDeadCharacters,
            closestToFirstPlayer
        ];

        for (const breaker of breakers) {
            players = breaker(players);
            if (players.length === 1) {
                return players;
            }
        }
        this.game.addAlert(
            'danger',
            'There was an issue with breaking the tie between {0}',
            players
        );
        return [];
    }
}

export default GameOverHandler;
