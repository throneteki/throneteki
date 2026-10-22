import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class BlackwaterBay extends DrawCard {
    // Blackwater Bay (11048)
    // Reaction: After the challenges phase begins, kneel Blackwater Bay to choose an opponent. Draw
    // 1 card for each kneeling character that player controls.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'challenge' && context.source.controller.canDraw()
            },
            cost: ability.costs.kneelSelf(),
            chooseOpponent: true,
            message: {
                format: '{player} kneels {source} to draw {cards}',
                args: {
                    cards: (context) =>
                        TextHelper.count(context.source.getNumToDraw(context.opponent), 'card')
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.source.getNumToDraw(context.opponent)
            }))
        });
    }

    getNumToDraw(opponent) {
        return opponent.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.kneeled
        );
    }
}

BlackwaterBay.code = '11048';

export default BlackwaterBay;
