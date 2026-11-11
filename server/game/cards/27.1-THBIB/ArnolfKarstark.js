import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArnolfKarstark extends DrawCard {
    // Arnolf Karstark (27011)
    // Reaction: After a character or location is sacrificed, stand Arnolf Karstark. (Limit once per
    // round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event) => ['character', 'location'].includes(event.card.getType())
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

ArnolfKarstark.code = '27011';

export default ArnolfKarstark;
