const DrawCard = require('../../drawcard.js');

class BodyGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Lord', 'Lady'] });
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.cards.includes(this.parent) && this.parent.canBeSaved() && event.allowSave,
                onCardsDiscarded: event => event.cards.includes(this.parent) && this.parent.canBeSaved() && event.allowSave
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                let parent = context.cardStateWhenInitiated.parent;
                context.event.saveCard(parent);
                this.game.addMessage('{0} sacrifices {1} to save {2}', this.controller, this, parent);
            }
        });
    }
}

BodyGuard.code = '01033';

module.exports = BodyGuard;
