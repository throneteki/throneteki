const DrawCard = require('../../drawcard.js');

class TheBoyKing extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lord' });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.card.getPrintedCost() <= 3 && this.parent.allowGameAction('gainPower')
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.parent.modifyPower(1);
                this.game.addMessage(
                    '{0} kneels {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

TheBoyKing.code = '04030';

module.exports = TheBoyKing;
