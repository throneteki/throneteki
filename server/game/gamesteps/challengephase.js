const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const Challenge = require('../challenge.js');
const ChallengeFlow = require('./challenge/challengeflow.js');
const ActionWindow = require('./actionwindow.js');

class ChallengePhase extends Phase {
    constructor(game) {
        super(game, 'challenge');
        this.initialise([
            new SimpleStep(this.game, () => this.beginPhase()),
            new SimpleStep(this.game, () => this.promptForChallenge())
        ]);
    }

    beginPhase() {
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
    }

    promptForChallenge() {
        if(this.remainingPlayers.length === 0) {
            return true;
        }

        this.game.queueStep(new ActionWindow(this.game, 'Before challenge', 'challengeBegin'));

        const ChallengeTypes = ['Military', 'Intrigue', 'Power'];

        let currentPlayer = this.remainingPlayers[0];
        let buttons = ChallengeTypes.map(challengeType => {
            return {
                text: challengeType,
                method: 'chooseChallengeType',
                arg: challengeType.toLowerCase(),
                disabled: () => !this.allowChallengeType(currentPlayer, challengeType.toLowerCase())
            };
        });

        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: buttons.concat([
                    { text: 'Done', method: 'completeChallenges' }
                ])
            },
            waitingPromptTitle: 'Waiting for opponent to initiate challenge'
        });
    }

    allowChallengeType(player, challengeType) {
        let opponents = this.game.getOpponents(player);

        if(opponents.length === 0) {
            return player.canInitiateChallenge(challengeType, null);
        }

        return opponents.some(opponent => player.canInitiateChallenge(challengeType, opponent));
    }

    chooseChallengeType(attackingPlayer, challengeType) {
        let opponents = this.game.getOpponents(attackingPlayer);

        if(opponents.length === 0) {
            this.initiateChallenge(attackingPlayer, null, challengeType);
            return true;
        }

        this.game.promptForOpponentChoice(attackingPlayer, {
            onSelect: opponent => {
                this.initiateChallenge(attackingPlayer, opponent, challengeType);
            },
            onCancel: () => {
                this.promptForChallenge();
            }
        });

        return true;
    }

    initiateChallenge(attackingPlayer, defendingPlayer, challengeType) {
        if(!attackingPlayer.canInitiateChallenge(challengeType, defendingPlayer)) {
            this.game.queueSimpleStep(() => this.promptForChallenge());
            return;
        }

        let challenge = new Challenge(this.game, {
            attackingPlayer: attackingPlayer,
            defendingPlayer: defendingPlayer,
            challengeType: challengeType,
            number: attackingPlayer.getNumberOfChallengesInitiated() + 1
        });
        this.game.currentChallenge = challenge;
        this.game.queueStep(new ChallengeFlow(this.game, challenge));
        this.game.queueSimpleStep(() => this.cleanupChallenge());
        this.game.queueSimpleStep(() => this.promptForChallenge());
    }

    cleanupChallenge() {
        let challenge = this.game.currentChallenge;
        challenge.resetCards();
        challenge.finish();
        challenge.unregisterEvents();
        this.game.currentChallenge = null;
        this.game.raiseEvent('onChallengeFinished', { challenge: challenge });
    }

    completeChallenges(player) {
        this.game.addMessage('{0} has finished their challenges', player);

        this.remainingPlayers.shift();
        this.promptForChallenge();
        return true;
    }
}

module.exports = ChallengePhase;
