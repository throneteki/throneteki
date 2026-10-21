import DrawCard from '../../drawcard.js';

class MaesterKerwin extends DrawCard {
    // Maester Kerwin (13091)
    // Interrupt: When another character would be killed, kill Maester Kerwin to save that
    // character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === this.controller &&
                    event.card !== this
            },
            cost: ability.costs.killSelf(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} kills {1} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

MaesterKerwin.code = '13091';

export default MaesterKerwin;
