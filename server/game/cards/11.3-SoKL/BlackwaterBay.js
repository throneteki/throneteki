import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class BlackwaterBay extends DrawCard {
    // Blackwater Bay (11048)
    // Reaction: After the challenges phase begins, kneel Blackwater Bay to choose an opponent. Draw
    // 1 card for each kneeling character that player controls.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge' && this.controller.canDraw()
            },
            cost: ability.costs.kneelSelf(),
            chooseOpponent: true,
            handler: (context) => {
                let numDrawn = context.player.drawCardsToHand(
                    this.getNumToDraw(context.opponent)
                ).length;
                this.game.addMessage(
                    '{0} kneels {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(numDrawn, 'card')
                );
            }
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
