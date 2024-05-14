import DrawCard from '../../drawcard.js';

class Ghost extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: ['thenightswatch', 'stark'] });
        this.interrupt({
            when: {
                onCharacterKilled: (event) =>
                    event.card === this.parent && this.parent.canBeSaved() && event.allowSave
            },
            cost: ability.costs.returnSelfToHand(),
            canCancel: true,
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} returns {1} to their hand to save {2}',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

Ghost.code = '07021';

export default Ghost;
