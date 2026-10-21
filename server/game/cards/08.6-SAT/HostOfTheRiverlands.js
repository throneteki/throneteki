import DrawCard from '../../drawcard.js';

class HostOfTheRiverlands extends DrawCard {
    // Host of the Riverlands (08101)
    // Bestow (3). No attachments.
    // Reaction: After a House Tully character you control gains power, discard 1 gold from Host of
    // the Riverlands to have that character gain 1 power. (Limit once per phase.)
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
