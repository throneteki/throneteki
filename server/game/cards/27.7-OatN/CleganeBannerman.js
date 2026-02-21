import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class CleganeBannerman extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event) => event.isPillage && event.source === this
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.event.card.controller
            },
            message: {
                format: "{player} uses {source} to place {target} on top of {controller}'s deck",
                args: { controller: (context) => context.event.card.controller }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeCard((context) => ({
                        card: context.target,
                        location: 'draw deck'
                    })),
                    context
                );
            }
        });
    }
}

CleganeBannerman.code = '27529';
CleganeBannerman.version = '2.0.0';

export default CleganeBannerman;
