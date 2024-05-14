import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheQueensRetinue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            condition: (context) => context.player.canPutIntoPlay(this, 'outOfShadows'),
            handler: (context) => {
                this.game
                    .resolveGameAction(
                        GameActions.putIntoPlay((context) => ({
                            player: context.player,
                            card: this
                        })),
                        context
                    )
                    .thenExecute(() => {
                        for (let opponent of this.game.getOpponents(this.controller)) {
                            if (opponent.canDraw()) {
                                this.game.promptWithMenu(opponent, this, {
                                    activePrompt: {
                                        menuTitle: 'Draw 2 cards?',
                                        buttons: [
                                            { text: 'Yes', method: 'draw2' },
                                            { text: 'No', method: 'doNotDraw' }
                                        ]
                                    },
                                    source: this
                                });
                            }
                        }
                    });
            }
        });
    }

    draw2(opponent) {
        opponent.drawCardsToHand(2);
        this.game.addMessage(
            '{0} uses {1} to put {1} into play from shadows and have {2} draw 2 cards',
            this.controller,
            this,
            opponent
        );
        return true;
    }

    doNotDraw(opponent) {
        this.game.addMessage(
            '{0} uses {1} to put {1} into play from shadows, but {2} does not draw',
            this.controller,
            this,
            opponent
        );
        return true;
    }
}

TheQueensRetinue.code = '17137';

export default TheQueensRetinue;
