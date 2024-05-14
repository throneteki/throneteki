import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class OldtownScholar extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardsDrawn: (event) =>
                    event.player !== this.controller &&
                    this.controller.canDraw() &&
                    this.game.currentPhase !== 'draw'
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let numToDraw = context.event.cards.length;
                let drawn = context.player.drawCardsToHand(numToDraw);
                this.game.addMessage(
                    '{0} kneels {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(drawn.length, 'card')
                );
            }
        });
    }
}

OldtownScholar.code = '10041';

export default OldtownScholar;
