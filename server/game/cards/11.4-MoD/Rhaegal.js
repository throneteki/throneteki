import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Rhaegal extends DrawCard {
    // Rhaegal (11073)
    // Ambush (5). No attachments.
    // Reaction: After an opponent's character is killed by a card effect, stand Rhaegal.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    !context.game.claim.isApplying &&
                    event.card.controller !== context.source.controller &&
                    context.source.kneeled
            },
            message: '{player} stands {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

Rhaegal.code = '11073';

export default Rhaegal;
