import DrawCard from '../../drawcard.js';

class PoorFellows extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isAttacking() &&
                    this.canChangeGameState()
            },
            handler: (context) => {
                let opponent = context.event.challenge.loser;
                this.game.addMessage(
                    '{0} uses {1} to have {2} choose between drawing 1 card or gaining 1 power',
                    context.player,
                    this,
                    opponent
                );

                this.game.promptWithMenu(opponent, this, {
                    activePrompt: {
                        menuTitle: 'Opponent draws 1 card or Poor Fellows gains 1 power?',
                        buttons: [
                            { text: 'Draws card', method: 'draw' },
                            { text: 'Gains power', method: 'gainsPower' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    draw() {
        this.controller.drawCardsToHand(1);
        this.game.addMessage('{0} draws 1 card', this.controller);
        return true;
    }

    gainsPower() {
        this.modifyPower(1);
        this.game.addMessage('{0} gains 1 power on {1}', this.controller, this);
        return true;
    }

    canChangeGameState() {
        return this.canGainPower() || this.controller.canDraw();
    }
}

PoorFellows.code = '11057';

export default PoorFellows;
