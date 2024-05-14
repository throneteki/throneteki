import DrawCard from '../../drawcard.js';

class IronMines extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    event.card.controller === this.controller &&
                    this.game.currentPhase !== 'plot'
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} kneels and sacrifices {1} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

IronMines.code = '17108';

export default IronMines;
