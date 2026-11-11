import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RoastBoar extends DrawCard {
    // Roast Boar (26002)
    // Opponent's character only.
    // Attached character's controller may choose not to stand attached character during the
    // standing phase.
    // Reaction: After attached character stands, sacrifice Roast Boar to draw 3 cards.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.whileAttached({
            effect: ability.effects.optionalStandDuringStanding()
        });
        this.reaction({
            when: {
                onCardStood: (event, context) => event.card === context.source.parent
            },
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to draw 3 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 3 }))
        });
    }
}

RoastBoar.code = '26002';

export default RoastBoar;
