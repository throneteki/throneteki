import BaseStep from '../basestep.js';
import Claim from '../../Claim.js';
import GameActions from '../../GameActions/index.js';

class ClaimPrompt extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
        this.claim = Claim.createFromChallenge(challenge);
    }

    continue() {
        // TODO: Remove this prompt completely
        this.game.promptWithMenu(this.challenge.winner, this, {
            activePrompt: {
                menuTitle: 'Perform before claim actions',
                buttons: [
                    { text: 'Apply Claim', method: 'applyClaim' },
                    { text: 'Continue', method: 'cancelClaim' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to apply claim'
        });
    }

    applyClaim() {
        if (this.claim.allowMultipleOpponentClaim()) {
            this.promptForAdditionalOpponents();
        } else {
            this.processClaim();
        }

        return true;
    }

    cancelClaim(player) {
        this.game.addAlert('danger', '{0} continues without applying claim', player, this);

        return true;
    }

    promptForAdditionalOpponents() {
        let opponents = this.game
            .getOpponents(this.claim.winner)
            .filter((opponent) => !this.claim.recipients.includes(opponent));

        if (opponents.length === 0) {
            this.processClaim();
            return true;
        }

        let buttons = opponents.map((opponent) => {
            return { text: opponent.name, method: 'addOpponent', arg: opponent.name };
        });

        this.game.promptWithMenu(this.challenge.winner, this, {
            activePrompt: {
                menuTitle: `Apply ${this.challenge.challengeType} claim against additional opponents?`,
                buttons: buttons.concat([{ text: 'Done', method: 'processClaim' }])
            },
            waitingPromptTitle: 'Waiting for opponent to apply claim'
        });
    }

    addOpponent(player, opponentName) {
        let opponent = this.game.getPlayerByName(opponentName);

        if (!opponent) {
            return false;
        }

        this.claim.addRecipient(opponent);

        this.promptForAdditionalOpponents();

        return true;
    }

    processClaim() {
        this.game.resolveGameAction(
            GameActions.applyClaim({
                player: this.challenge.winner,
                challenge: this.challenge,
                claim: this.claim,
                game: this.game
            })
        );

        return true;
    }
}

export default ClaimPrompt;
