import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class TheInnAtTheCrossroads extends DrawCard {
    // The Inn at the Crossroads (11098)
    // Shadow (1).
    // Dominance Action: Kneel The Inn at the Crossroads to draw 3 cards and choose an opponent.
    // Give control of The Inn at the Crossroads to that player.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 3 cards',
            phase: 'dominance',
            cost: ability.costs.kneelSelf(),
            chooseOpponent: true,
            handler: (context) => {
                let numCardsDrawn = context.player.drawCardsToHand(3).length;
                this.game.takeControl(context.opponent, this);
                this.game.addMessage(
                    '{0} kneels {1} to draw {2} and give control of {1} to {3}',
                    context.player,
                    this,
                    TextHelper.count(numCardsDrawn, 'card'),
                    context.opponent
                );
            }
        });
    }
}

TheInnAtTheCrossroads.code = '11098';

export default TheInnAtTheCrossroads;
