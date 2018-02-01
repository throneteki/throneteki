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
            new ActionWindow(this.game, 'Before challenge', 'challengeBegin'),
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

        var currentPlayer = this.remainingPlayers[0];
        this.game.promptWithMenu(currentPlayer, this, {
            activePrompt: {
                menuTitle: '',
                buttons: [
                    { text: 'Military', method: 'chooseChallengeType', arg: 'military' },
                    { text: 'Intrigue', method: 'chooseChallengeType', arg: 'intrigue' },
                    { text: 'Power', method: 'chooseChallengeType', arg: 'power' },
                    { text: 'Done', method: 'completeChallenges' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to initiate challenge'
        });

        return false;
    }

    chooseChallengeType(attackingPlayer, challengeType) {
        let opponents = this.game.getOpponents(attackingPlayer);

        if(opponents.length === 0) {
            this.initiateChallenge(attackingPlayer, null, challengeType);
            return;
        }

        this.game.promptForOpponentChoice(attackingPlayer, {
            onSelect: opponent => {
                this.initiateChallenge(attackingPlayer, opponent, challengeType);
            }
        });
    }

    initiateChallenge(attackingPlayer, defendingPlayer, challengeType) {
        if(!attackingPlayer.canInitiateChallenge(challengeType, defendingPlayer)) {
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
        this.game.queueStep(new SimpleStep(this.game, () => this.cleanupChallenge()));
        this.game.queueStep(new ActionWindow(this.game, 'Before challenge', 'challengeBegin'));
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
        return true;
    }
}

module.exports = ChallengePhase;
