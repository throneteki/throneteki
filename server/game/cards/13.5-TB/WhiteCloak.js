const DrawCard = require('../../drawcard.js');

class WhiteCloak extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current', trait: ['Knight'] });
        this.whileAttached({
            effect: [ability.effects.addTrait('Kingsguard')]
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave && event.card.canBeSaved() && this.isKingOrQueen(event.card)
            },
            cost: ability.costs.kneelParent(),
            handler: (context) => {
                let parent = context.cardStateWhenInitiated.parent;
                context.event.saveCard();
                this.game.addMessage('{0} kneels {1} to save {2}', this.controller, this, parent);
            }
        });
    }

    isKingOrQueen(card) {
        return card.hasTrait('King') || card.hasTrait('Queen');
    }
}

WhiteCloak.code = '13098';

module.exports = WhiteCloak;
