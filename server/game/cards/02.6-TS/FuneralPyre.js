import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class FuneralPyre extends DrawCard {
    // Funeral Pyre (02114)
    // Reaction: After a Lord or Lady character is killed, kneel your faction card to draw 3 cards.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    (event.cardStateWhenKilled.hasTrait('Lord') ||
                        event.cardStateWhenKilled.hasTrait('Lady')) &&
                    this.controller.canDraw()
            },
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(3).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

FuneralPyre.code = '02114';

export default FuneralPyre;
