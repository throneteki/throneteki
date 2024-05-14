import DrawCard from '../../drawcard.js';

class HostOfTheRiverlands extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.controller === this.controller &&
                    event.card.hasTrait('House Tully')
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            handler: (context) => {
                context.event.card.modifyPower(1);
                this.game.addMessage(
                    '{0} discards a gold from {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

HostOfTheRiverlands.code = '08101';

export default HostOfTheRiverlands;
