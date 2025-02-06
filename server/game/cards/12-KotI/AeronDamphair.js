import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class AeronDamphair extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.cardStateWhenKilled.hasTrait('drowned god') &&
                    event.cardStateWhenKilled.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

AeronDamphair.code = '12005';

export default AeronDamphair;
