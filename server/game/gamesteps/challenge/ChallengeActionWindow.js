import ActionWindow from '../actionwindow.js';
import ChallengeTypes from '../../ChallengeTypes.js';

// The action window before each challenge (Appendix I, between 4.1 and 4.2). Every other player
// who stops at it has their turn before the active player, whose turn is choosing a challenge: that
// choice closes the window, and an action taken while choosing gives the others another turn.
class ChallengeActionWindow extends ActionWindow {
    constructor(game, phase, activePlayer, { otherPlayers = true } = {}) {
        super(game, 'Before challenge', 'challengeBegin');
        this.phase = phase;
        this.activePlayer = activePlayer;
        this.otherPlayers = otherPlayers;
        this.choice = null;
    }

    lazyFetchPlayers() {
        if (!this.players) {
            this.players = this.activePlayerLast(this.game.getPlayersInFirstPlayerOrder());
        }
    }

    activePlayerLast(players) {
        return players.filter((player) => player !== this.activePlayer).concat([this.activePlayer]);
    }

    skipCondition(player) {
        if (player === this.activePlayer) {
            return false;
        }

        return !this.otherPlayers || !player.promptedActionWindows[this.windowName];
    }

    activePrompt(player) {
        if (player !== this.activePlayer) {
            return super.activePrompt();
        }

        const buttons = ChallengeTypes.asButtons((challengeType) => ({
            disabled: () => !this.phase.allowChallengeType(player, challengeType)
        }));

        return {
            menuTitle: '',
            buttons: buttons.concat([
                {
                    text: 'Done',
                    arg: 'done',
                    disabled: () => this.phase.mustInitiateChallenge(player)
                }
            ])
        };
    }

    waitingPrompt() {
        if (this.currentPlayer === this.activePlayer) {
            return { menuTitle: 'Waiting for opponent to initiate challenge' };
        }

        return super.waitingPrompt();
    }

    onMenuCommand(player, arg) {
        if (player !== this.currentPlayer) {
            return false;
        }

        if (player === this.activePlayer) {
            if (!this.isAllowedChoice(player, arg)) {
                return false;
            }

            this.choice = arg;
        }

        this.completePlayer();

        return true;
    }

    isAllowedChoice(player, arg) {
        if (arg === 'done') {
            return !this.phase.mustInitiateChallenge(player);
        }

        return (
            ChallengeTypes.all.some((challengeType) => challengeType.value === arg) &&
            this.phase.allowChallengeType(player, arg)
        );
    }

    markActionAsTaken(player) {
        this.choice = null;
        this.setPlayers(this.activePlayerLast(this.rotatedPlayerOrder(player)));
    }
}

export default ChallengeActionWindow;
