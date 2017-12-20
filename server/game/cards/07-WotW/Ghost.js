const DrawCard = require('../../drawcard.js');

class Ghost extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: ['thenightswatch', 'stark'] });
        this.interrupt({
            when: {
                onCharactersKilled: event => {
                    if(event.cards.includes(this.parent) && this.parent.canBeSaved() && event.allowSave) {
                        this.parentCard = this.parent;
                        return true;
                    }
                    return false;
                }
            },
            cost: ability.costs.returnSelfToHand(),
            canCancel: true,
            handler: context => {
                context.event.saveCard(this.parentCard);
                this.game.addMessage('{0} returns {1} to their hand to save {2}', this.controller, this, this.parentCard);
            }
        });
    }
}

Ghost.code = '07021';

module.exports = Ghost;
