import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheDoomOfValyria extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            condition: (context) => context.player.getNumberOfUsedPlots() >= 3,
            message:
                '{player} uses {source} to discard all non-limited cards from play, and all cards from shadows',
            handler: (context) => {
                const opponents = this.game.getOpponentsInFirstPlayerOrder(context.player);
                this.remainingOpponents = opponents.filter((opponent) => opponent.hand.length >= 3);
                if (context.ability.cannotBeCanceled) {
                    this.resolveDiscardFromPlay();
                } else {
                    this.promptForCancel();
                }
            }
        });
    }
    promptForCancel() {
        if (this.remainingOpponents.length === 0) {
            this.resolveDiscardFromPlay();
            return true;
        }

        const nextOpponent = this.remainingOpponents.shift();
        this.game.promptWithMenu(nextOpponent, this, {
            activePrompt: {
                menuTitle: 'Discard hand to cancel?',
                buttons: [
                    { text: 'Yes', method: 'cancelResolution' },
                    { text: 'No', method: 'promptForCancel' }
                ]
            },
            source: this
        });

        return true;
    }

    cancelResolution(opponent) {
        this.game.addMessage(
            '{0} discards their hand to cancel the effects of {1}',
            opponent,
            this
        );
        this.game.resolveGameAction(
            GameActions.simultaneously(() =>
                opponent.hand.map((card) => GameActions.discardCard({ card, source: this }))
            )
        );
        return true;
    }

    resolveDiscardFromPlay() {
        this.game.resolveGameAction(
            GameActions.simultaneously(() =>
                this.game
                    .allCards(
                        (card) =>
                            (card.location === 'play area' && !card.isLimited()) ||
                            card.location === 'shadows'
                    )
                    .map((card) => GameActions.discardCard({ card, source: this }))
            )
        );
    }
}

TheDoomOfValyria.code = '26100';

export default TheDoomOfValyria;
