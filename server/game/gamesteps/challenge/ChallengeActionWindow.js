import ActionWindow from '../actionwindow.js';
import ChallengeTypes from '../../ChallengeTypes.js';

// The action window before each challenge (Appendix I, between 4.1 and 4.2). The active player's
// turn in it is choosing a challenge, which is their pass: the choice stands only if every other
// player then passes.
class ChallengeActionWindow extends ActionWindow {
    constructor(game, phase, activePlayer, { otherPlayers = true } = {}) {
        super(game, 'Before challenge', 'challengeBegin');
        this.phase = phase;
        this.activePlayer = activePlayer;
        this.otherPlayers = otherPlayers;
        this.choice = null;
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
        super.markActionAsTaken(player);
    }
}

export default ChallengeActionWindow;
