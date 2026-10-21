import DrawCard from '../../drawcard.js';

class TheBoyKing extends DrawCard {
    // The Boy King (04030)
    // Lord character only.
    // Attached character gains the King trait.
    // Reaction: After a character with printed cost 3 or lower is killed, kneel The Boy King to
    // have attached character gain 1 power.
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

export default TheBoyKing;
