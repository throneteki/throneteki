import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Ghost extends DrawCard {
    // Ghost (07021)
    // [thenightswatch] or [stark] character only.
    // Interrupt: When attached character would be killed, return Ghost to your hand to save that
    // character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: ['thenightswatch', 'stark'] });
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card === context.source.parent &&
                    context.source.parent.canBeSaved() &&
                    event.allowSave
            },
            cost: ability.costs.returnSelfToHand(),
            canCancel: true,
            message: {
                format: '{player} returns {source} to their hand to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

Ghost.code = '07021';

export default Ghost;
