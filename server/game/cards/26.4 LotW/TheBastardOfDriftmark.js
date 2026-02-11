import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBastardOfDriftmark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.controller === this.controller &&
                    event.card.getType() === 'location' &&
                    event.card.hasTrait('Warship')
            },
            limit: ability.limit.perPhase(2),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard({ card: this })
        });
    }
}

TheBastardOfDriftmark.code = '26077';

export default TheBastardOfDriftmark;
