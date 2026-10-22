import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhatIsDeadMayNeverDie extends DrawCard {
    // What Is Dead May Never Die (12023)
    // Reaction: After you win dominance, choose a [greyjoy] character in your dead pile and put it
    // into play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    context.source.controller === event.winner
            },
            target: {
                cardCondition: (card, context) => context.source.cardCondition(card)
            },
            message: '{player} plays {source} to put {target} into play from their dead pile',
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
            card.isFaction('greyjoy') &&
            this.controller.canPutIntoPlay(card)
        );
    }
}

WhatIsDeadMayNeverDie.code = '12023';

export default WhatIsDeadMayNeverDie;
