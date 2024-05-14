import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class FickleBannerman extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.challengeType === 'power'
            },
            handler: (context) => {
                this.challengeWinner = context.event.challenge.winner;

                if (!this.hasToken(Tokens.gold)) {
                    this.loseControl();
                    return;
                }

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Discard a gold from ' + this.name + '?',
                        buttons: [
                            { text: 'Yes', method: 'discardGold' },
                            { text: 'No', method: 'loseControl' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    discardGold() {
        this.modifyToken(Tokens.gold, -1);
        this.game.addMessage('{0} is forced to discard a gold from {1}', this.controller, this);

        return true;
    }

    loseControl() {
        this.game.takeControl(this.challengeWinner, this);
        this.game.addMessage('{0} takes control of {1}', this.challengeWinner, this);

        return true;
    }
}

FickleBannerman.code = '06007';

export default FickleBannerman;
