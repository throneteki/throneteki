import Phase from './phase.js';
import SimpleStep from './simplestep.js';
import Challenge from '../challenge.js';
import ChallengeFlow from './challenge/challengeflow.js';
import ChallengeTypes from '../ChallengeTypes.js';
import ActionWindow from './actionwindow.js';
import { ChallengeTracker } from '../EventTrackers/index.js';

class ChallengePhase extends Phase {
    constructor(game) {
        super(game, 'challenge');
        this.initialise([
            new SimpleStep(this.game, () => this.beginPhase()),
            new SimpleStep(this.game, () => this.promptForChallenge())
        ]);

        this.tracker = ChallengeTracker.forPhase(game);
    }

    beginPhase() {
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();

        for (let player of this.remainingPlayers) {
            player.resetChallengesPerformed();
        }
    }

    promptForChallenge() {
        if (this.remainingPlayers.length === 0) {
            return true;
        }

        this.game.queueStep(new ActionWindow(this.game, 'Before challenge', 'challengeBegin'));

        const currentPlayer = this.remainingPlayers[0];
        const buttons = ChallengeTypes.asButtons((challengeType) => ({
            method: 'chooseChallengeType',
            disabled: () => !this.allowChallengeType(currentPlayer, challengeType)
        }));

        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: buttons.concat([
                    {
                        text: 'Done',
                        method: 'completeChallenges',
                        disabled: () => this.mustInitiateChallenge(currentPlayer)
                    }
                ])
            },
            waitingPromptTitle: 'Waiting for opponent to initiate challenge'
        });
    }

    allowChallengeType(player, challengeType) {
        const opponents = this.game.getOpponents(player);

        if (opponents.length === 0) {
            return player.canInitiateChallenge(challengeType, null, [null]);
        }

        return opponents.some((opponent) =>
            player.canInitiateChallenge(challengeType, opponent, opponents)
        );
    }

    mustInitiateChallenge(player) {
        const opponents = this.game.getOpponents(player);

        if (opponents.length === 0) {
            opponents.push(null);
        }

        return ChallengeTypes.all.some((challengeType) =>
            opponents.some((opponent) =>
                player.mustInitiateChallenge(challengeType.value, opponent, opponents)
            )
        );
    }

    chooseChallengeType(attackingPlayer, challengeType) {
        let opponents = this.game.getOpponents(attackingPlayer);

        if (opponents.length === 0) {
            this.initiateChallenge(attackingPlayer, null, challengeType);
            return true;
        }

        this.game.promptForOpponentChoice(attackingPlayer, {
            enabled: (opponent) => attackingPlayer.canInitiateChallenge(challengeType, opponent, opponents),
            onSelect: (opponent) => {
                this.initiateChallenge(attackingPlayer, opponent, challengeType);
            },
            onCancel: () => {
                this.promptForChallenge();
            }
        });

        return true;
    }

    initiateChallenge(attackingPlayer, defendingPlayer, challengeType) {
        let opponents = this.game.getOpponents(attackingPlayer);
        if (!attackingPlayer.canInitiateChallenge(challengeType, defendingPlayer, opponents)) {
            this.game.queueSimpleStep(() => this.promptForChallenge());
            return;
        }

        let challenge = new Challenge(this.game, {
            attackingPlayer: attackingPlayer,
            defendingPlayer: defendingPlayer,
            challengeType: challengeType,
            number: this.tracker.count({ attackingPlayer }) + 1,
            totalNumber: this.tracker.count({}) + 1
        });
        this.game.currentChallenge = challenge;
        this.game.currentChallengeStep = new ChallengeFlow(this.game, challenge);
        this.game.queueStep(this.game.currentChallengeStep);
        this.game.queueSimpleStep(() => this.cleanupChallenge());
        this.game.queueSimpleStep(() => this.promptForChallenge());
    }

    cleanupChallenge() {
        let challenge = this.game.currentChallenge;
        challenge.resetCards();
        challenge.finish();
        challenge.unregisterEvents();
        this.game.currentChallenge = null;
        this.game.currentChallengeStep = null;
        this.game.raiseEvent('onChallengeFinished', { challenge: challenge });
    }

    completeChallenges(player) {
        this.game.addMessage('{0} has finished their challenges', player);

        this.remainingPlayers.shift();
        this.promptForChallenge();
        return true;
    }
}

export default ChallengePhase;
