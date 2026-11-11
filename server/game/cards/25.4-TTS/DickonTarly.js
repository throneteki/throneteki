import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DickonTarly extends DrawCard {
    // Dickon Tarly (25075)
    // Reaction: After a [tyrell] character you control stands, stand Dickon Tarly. (Limit once per
    // phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStood: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.card.isFaction('tyrell')
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

DickonTarly.code = '25075';

export default DickonTarly;
