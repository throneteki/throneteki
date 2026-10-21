import DrawCard from '../../drawcard.js';

class IronMines extends DrawCard {
    // Iron Mines (02092)
    // Interrupt: When a character would be killed, sacrifice Iron Mines to save that character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} sacrifices {1} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

IronMines.code = '02092';

export default IronMines;
