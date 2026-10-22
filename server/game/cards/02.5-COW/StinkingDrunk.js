import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StinkingDrunk extends DrawCard {
    // Stinking Drunk (02088)
    // Opponent's character only.
    // Reaction: After attached character stands, sacrifice Stinking Drunk to kneel that character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.reaction({
            when: {
                onCardStood: (event, context) => event.card === context.source.parent
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to kneel {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.kneelCard((context) => ({ card: context.event.card }))
        });
    }
}

StinkingDrunk.code = '02088';

export default StinkingDrunk;
