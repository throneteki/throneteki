import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SpareBoot extends DrawCard {
    // Spare Boot (10031)
    // Challenges Action: Choose an attachment attached to a character you control. Stand that
    // attachment and move it to Spare Boot. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and move attachment',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'attachment' &&
                    card.parent &&
                    card.parent.controller === context.player
            },
            message: '{player} uses {source} and {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.attach((context) => ({
                    attachment: context.target,
                    target: context.source
                }))
            ])
        });
    }
}

SpareBoot.code = '10031';

export default SpareBoot;
