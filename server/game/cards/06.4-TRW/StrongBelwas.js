import DrawCard from '../../drawcard.js';

class StrongBelwas extends DrawCard {
    // Strong Belwas (06073)
    // Bestow (2).
    // Interrupt: When another unique [targaryen] character would be killed, discard 1 gold from
    // Strong Belwas to save it. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.controller === this.controller &&
                    event.card !== this &&
                    event.card.isUnique() &&
                    event.card.isFaction('targaryen') &&
                    event.card.canBeSaved()
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to save {2}',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

StrongBelwas.code = '06073';

export default StrongBelwas;
