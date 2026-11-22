import UiPrompt from '../uiprompt.js';
import ChallengeTypes from '../../ChallengeTypes.js';

// The active player initiates a challenge or passes (Appendix I, 4.2). When any player stops at
// the action window before it, that window is its own step and no actions can be taken while
// choosing. When nobody stops at it, the active player can still take actions while choosing:
// the other players gave up their opportunity by not stopping at the window.
class ChallengeChoicePrompt extends UiPrompt {
    constructor(game, phase, activePlayer, { allowActions = false } = {}) {
        super(game);
        this.phase = phase;
        this.activePlayer = activePlayer;
        this.allowActions = allowActions;
        this.windowName = 'challengeChoice';
        this.choice = null;
    }

    get currentPlayer() {
        return this.activePlayer;
    }

    continue() {
        const completed = super.continue();
        if (this.allowActions) {
            this.game.currentActionWindow = completed ? null : this;
        }

        return completed;
    }

    markActionAsTaken() {}

    getPlayer() {
        return this.activePlayer;
    }

    activeCondition(player) {
        return player === this.activePlayer;
    }

    activePrompt(player) {
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
        return { menuTitle: 'Waiting for opponent to initiate challenge' };
    }

    onMenuCommand(player, arg) {
        if (player !== this.activePlayer || !this.isAllowedChoice(player, arg)) {
            return false;
        }

        this.choice = arg;
        this.complete();

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
}

export default ChallengeChoicePrompt;
