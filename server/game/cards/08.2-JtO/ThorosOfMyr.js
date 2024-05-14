import DrawCard from '../../drawcard.js';

class ThorosOfMyr extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card !== this &&
                    !event.card.isLoyal() &&
                    event.card.controller === this.controller &&
                    event.card.canBeSaved()
            },
            cost: [ability.costs.kneelSelf(), ability.costs.discardPowerFromSelf(1)],
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} kneels and discards 1 power from {1} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

ThorosOfMyr.code = '08037';

export default ThorosOfMyr;
