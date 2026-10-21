import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Nightfall extends DrawCard {
    // Nightfall (25064)
    // If attached character has the House Harlaw trait, it gains renown.
    // Reaction: After you win a challenge in which attached character is participating, kneel
    // Nightfall to have each player check reserve.
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
