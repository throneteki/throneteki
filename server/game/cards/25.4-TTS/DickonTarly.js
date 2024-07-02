import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DickonTarly extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStood: (event) =>
                    event.card.controller === this.controller && event.card.isFaction('tyrell')
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

DickonTarly.code = '25075';

export default DickonTarly;
