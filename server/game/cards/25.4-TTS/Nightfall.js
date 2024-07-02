import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Nightfall extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: (card) => card.hasTrait('House Harlaw'),
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.parent &&
                    this.parent.isParticipating()
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {costs.kneel} to have each player check for reserve',
            gameAction: GameActions.checkReserve()
        });
    }
}

Nightfall.code = '25064';

export default Nightfall;
