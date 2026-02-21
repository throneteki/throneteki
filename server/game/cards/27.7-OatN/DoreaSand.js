import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DoreaSand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return to hand',
            message: '{player} uses {source} to return {source} to their hand',
            phase: 'challenge',
            gameAction: GameActions.returnCardToHand({ card: this }).then(() => ({
                condition: (context) => {
                    const playerCharacterCount = context.player.getNumberOfCardsInPlay({
                        type: 'character'
                    });
                    return this.game
                        .opponents(context.player)
                        .every(
                            (player) =>
                                player.getNumberOfCardsInPlay({ type: 'character' }) >
                                playerCharacterCount
                        );
                },
                target: {
                    type: 'select',
                    cardCondition: {
                        type: 'character',
                        or: [{ name: 'The Red Viper' }, { trait: 'Sand Snake' }],
                        controller: 'current'
                    }
                },
                message: 'Then, {player} stands {target}',
                handler: (context) => {
                    this.game.resolveGameAction(
                        GameActions.standCard((context) => ({ card: context.target })),
                        context
                    );
                }
            }))
        });
    }
}

DoreaSand.code = '27539';
DoreaSand.version = '1.0.0';

export default DoreaSand;
