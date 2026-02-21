import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArnolfKarstark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event) =>
                    event.card.controller === this.controller &&
                    ['character', 'location'].includes(event.card.getType())
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

ArnolfKarstark.code = '27562';
ArnolfKarstark.version = '1.0.0';

export default ArnolfKarstark;
