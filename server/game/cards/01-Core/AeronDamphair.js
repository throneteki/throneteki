import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AeronDamphair extends DrawCard {
    // Aeron Damphair (01065)
    // Reaction: After you win dominance, put an Ironborn character into play from your dead pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    context.source.controller === event.winner
            },
            target: {
                activePromptTitle: 'Select character',
                cardCondition: (card, context) => context.source.cardCondition(card)
            },
            message: '{player} uses {source} to put {target} into play from their dead pile',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }

    cardCondition(card) {
        return (
            card.controller === this.controller &&
            card.getType() === 'character' &&
            card.location === 'dead pile' &&
            card.hasTrait('Ironborn') &&
            this.controller.canPutIntoPlay(card)
        );
    }
}

AeronDamphair.code = '01065';

export default AeronDamphair;
