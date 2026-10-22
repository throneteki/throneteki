import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FuneralPyre extends DrawCard {
    // Funeral Pyre (02114)
    // Reaction: After a Lord or Lady character is killed, kneel your faction card to draw 3 cards.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    (event.cardStateWhenKilled.hasTrait('Lord') ||
                        event.cardStateWhenKilled.hasTrait('Lady')) &&
                    context.source.controller.canDraw()
            },
            cost: ability.costs.kneelFactionCard(),
            message: '{player} uses {source} to draw 3 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 3 }))
        });
    }
}

FuneralPyre.code = '02114';

export default FuneralPyre;
