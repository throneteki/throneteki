import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TobhoMottsArmory extends DrawCard {
    // Tobho Mott's Armory (02069)
    // Reaction: After you win dominance, kneel Tobho Mott's Armory to draw 1 card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    context.source.controller === event.winner &&
                    context.source.controller.canDraw()
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

TobhoMottsArmory.code = '02069';

export default TobhoMottsArmory;
