import PlotCard from '../../plotcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class ReturnToTheFields extends PlotCard {
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
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) => GameActions.sacrificeCard({ card }))
                    )
                );

                let cardsDrawn = context.player.drawCardsToHand(context.target.length).length;
                let goldGained = this.game.addGold(context.player, context.target.length);
                this.game.addMessage(
                    '{0} uses {1} to sacrifice {2}, draw {3}, and gain {4} gold',
                    context.player,
                    this,
                    context.target,
                    TextHelper.count(cardsDrawn, 'card'),
                    goldGained
                );
            }
        });
    }
}

ReturnToTheFields.code = '12047';

export default ReturnToTheFields;
