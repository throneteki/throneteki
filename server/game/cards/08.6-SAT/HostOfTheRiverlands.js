import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HostOfTheRiverlands extends DrawCard {
    // Host of the Riverlands (08101)
    // Bestow (3). No attachments.
    // Reaction: After a House Tully character you control gains power, discard 1 gold from Host of
    // the Riverlands to have that character gain 1 power. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event, context) =>
                    event.card.getType() === 'character' &&
                    event.card.controller === context.source.controller &&
                    event.card.hasTrait('House Tully')
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            message: {
                format: '{player} discards a gold from {source} to have {card} gain 1 power',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.event.card,
                amount: 1
            }))
        });
    }
}

HostOfTheRiverlands.code = '08101';

export default HostOfTheRiverlands;
