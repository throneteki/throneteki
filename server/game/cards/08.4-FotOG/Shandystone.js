import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Shandystone extends DrawCard {
    // Shandystone (08076)
    // Reaction: After you lose a challenge as the defending player, kneel Shandystone to choose and
    // stand a character you control.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.defendingPlayer === context.source.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.source.controller &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

Shandystone.code = '08076';

export default Shandystone;
