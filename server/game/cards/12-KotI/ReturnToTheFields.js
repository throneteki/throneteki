import PlotCard from '../../plotcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class ReturnToTheFields extends PlotCard {
    // Return to the Fields (12047)
    // When Revealed: You may sacrifice up to 3 characters. For each character sacrificed this way,
    // draw 1 card and gain 1 gold.
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
                    format: 'Then {player} draws {cards} and gains {gold} gold',
                    args: {
                        cards: (context) =>
                            TextHelper.count(context.parentContext.target.length, 'card'),
                        gold: (context) => context.parentContext.target.length
                    }
                },
                gameAction: GameActions.simultaneously((context) => [
                    GameActions.drawCards({
                        player: context.player,
                        amount: context.parentContext.target.length
                    }),
                    GameActions.gainGold({
                        player: context.player,
                        amount: context.parentContext.target.length
                    })
                ])
            })
        });
    }
}

ReturnToTheFields.code = '12047';

export default ReturnToTheFields;
