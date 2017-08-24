const DrawCard = require('../../../drawcard.js');

class BodyGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => {
                    if(event.cards.includes(this.parent) && this.parent.canBeSaved() && event.allowSave) {
                        this.parentCard = this.parent;
                        return true;
                    }
                    return false;
                },
                onCardsDiscarded: event => {
                    if(event.cards.includes(this.parent) && this.parent.canBeSaved() && event.allowSave) {
                        this.parentCard = this.parent;
                        return true;
                    }
                    return false;
                }
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                context.event.saveCard(this.parentCard);
                this.game.addMessage('{0} sacrifices {1} to save {2}', this.controller, this, this.parentCard);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('Lady') && !card.hasTrait('Lord')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

BodyGuard.code = '01033';

module.exports = BodyGuard;
