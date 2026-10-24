import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VaesTolorro extends DrawCard {
    // Vaes Tolorro (04074)
    // Interrupt: When a character with 1 or more power is killed, kneel Vaes Tolorro to move 1
    // power from that character to Vaes Tolorro. (Up to 2 power instead if that character's STR is
    // 0.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card.getPower() >= 1
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to move power from {pendingCard} to {source}',
                args: {
                    pendingCard: (context) => context.event.card
                }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.event.card,
                to: context.source,
                amount:
                    context.event.card.getPower() >= 2 && context.event.card.getStrength() === 0
                        ? 2
                        : 1
            }))
        });
    }
}

VaesTolorro.code = '04074';

export default VaesTolorro;
