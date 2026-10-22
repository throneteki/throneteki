import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhiteCloak extends DrawCard {
    // White Cloak (13098)
    // Knight character you control only.
    // Attached character gains the Kingsguard trait.
    // Interrupt: When a King or Queen character would be killed, kneel attached character to save
    // it.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current', trait: ['Knight'] });
        this.whileAttached({
            effect: [ability.effects.addTrait('Kingsguard')]
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    context.source.isKingOrQueen(event.card)
            },
            cost: ability.costs.kneelParent(),
            message: {
                format: '{player} kneels {source} to save {parent}',
                args: { parent: (context) => context.cardStateWhenInitiated.parent }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }

    isKingOrQueen(card) {
        return card.hasTrait('King') || card.hasTrait('Queen');
    }
}

WhiteCloak.code = '13098';

export default WhiteCloak;
