import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBastardOfDriftmark extends DrawCard {
    // The Bastard of Driftmark (26077)
    // Shadow (4). Stealth.
    // Reaction: After a Warship location enters play under your control, stand The Bastard of
    // Driftmark. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.source.controller &&
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
