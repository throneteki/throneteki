import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
                onCharacterKilled: (event, context) =>
                    event.card.getPrintedCost() <= 3 &&
                    context.source.parent.allowGameAction('gainPower')
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to have {parent} gain 1 power',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source.parent,
                amount: 1
            }))
        });
    }
}

TheBoyKing.code = '04030';

export default TheBoyKing;
