import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StrongBelwas extends DrawCard {
    // Strong Belwas (06073)
    // Bestow (2).
    // Interrupt: When another unique [targaryen] character would be killed, discard 1 gold from
    // Strong Belwas to save it. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    event.card.controller === context.source.controller &&
                    event.card !== context.source &&
                    event.card.isUnique() &&
                    event.card.isFaction('targaryen') &&
                    event.card.canBeSaved()
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            message: {
                format: '{player} discards 1 gold from {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

StrongBelwas.code = '06073';

export default StrongBelwas;
