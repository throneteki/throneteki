import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class StormsEndMaester extends DrawCard {
    // Storm's End Maester (11087)
    // Challenges Action: Kneel Storm's End Maester to choose an opponent. If you have more power on
    // your faction card than that player, draw 1 card.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            phase: 'challenge',
            condition: () => this.controller.canDraw(),
            cost: ability.costs.kneelSelf(),
            chooseOpponent: (opponent) => this.controller.faction.power > opponent.faction.power,
            handler: (context) => {
                let numDrawn = context.player.drawCardsToHand(1).length;
                this.game.addMessage(
                    '{0} kneels {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(numDrawn, 'card')
                );
            }
        });
    }
}

StormsEndMaester.code = '11087';

export default StormsEndMaester;
