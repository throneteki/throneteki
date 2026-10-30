import PlotCard from '../../plotcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class ReturnToTheFields extends PlotCard {
    // Return to the Fields (17157)
    // When Revealed: You may sacrifice up to 3 characters. For each character sacrificed this way,
    // draw 1 card.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                type: 'select',
                mode: 'upTo',
                numCards: 3,
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.controller === context.player,
                gameAction: 'sacrifice'
            },
            message: '{player} uses {source} to sacrifice {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.sacrificeCard({ card }))
            ).then({
                message: {
                    format: 'Then {player} draws {cards}',
                    args: {
                        cards: (context) =>
                            TextHelper.count(context.parentContext.target.length, 'card')
                    }
                },
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: context.parentContext.target.length
                }))
            })
        });
    }
}

ReturnToTheFields.code = '17157';

export default ReturnToTheFields;
