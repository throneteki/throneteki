import DrawCard from '../../drawcard.js';

class HealingExpertise extends DrawCard {
    // Healing Expertise (03044)
    // Interrupt: When a non-Army character you control would be killed, kneel a Maester character
    // to save it.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    !event.card.hasTrait('Army') &&
                    event.card.controller === this.controller
            },
            location: 'hand',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Maester') && card.getType() === 'character'
            ),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} plays {1} to kneel {2} to save {3}',
                    this.controller,
                    this,
                    context.costs.kneel,
                    context.event.card
                );
            }
        });
    }
}

HealingExpertise.code = '03044';

export default HealingExpertise;
