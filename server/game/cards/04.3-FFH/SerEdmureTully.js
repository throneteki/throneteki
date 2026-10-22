import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerEdmureTully extends DrawCard {
    // Ser Edmure Tully (04041)
    // Reaction: After a character gains power, move 1 power from that character to a House Tully
    // character. (Limit once per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) => event.card.getType() === 'character'
            },
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: (card, context) =>
                    card !== context.event.card &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('House Tully')
            },
            message: {
                format: '{player} uses {source} to move 1 power from {card} to {target}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.card,
                to: context.target,
                amount: 1
            }))
        });
    }
}

SerEdmureTully.code = '04041';

export default SerEdmureTully;
