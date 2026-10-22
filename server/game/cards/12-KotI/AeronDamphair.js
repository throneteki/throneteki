import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AeronDamphair extends DrawCard {
    // Aeron Damphair (12005)
    // Insight.
    // Reaction: After another Drowned God character you control is killed, draw 1 card. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card.hasTrait('drowned god') &&
                    event.card.controller === context.source.controller
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

AeronDamphair.code = '12005';

export default AeronDamphair;
