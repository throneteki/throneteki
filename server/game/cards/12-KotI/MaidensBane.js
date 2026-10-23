import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaidensBane extends DrawCard {
    // Maiden's Bane (12019)
    // Reaction: After you win an unopposed challenge, kneel Maiden's Bane to choose and stand an
    // attacking character. Then, if that character is a Captain, stand Maiden's Bane.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({ winner: context.player, unopposed: true })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target })).then(
                (context) => ({
                    condition: () => context.target.hasTrait('Captain'),
                    message: '{player} then stands {source}',
                    gameAction: GameActions.standCard((context) => ({ card: context.source }))
                })
            )
        });
    }
}

MaidensBane.code = '12019';

export default MaidensBane;
