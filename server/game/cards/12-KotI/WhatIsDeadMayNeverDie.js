import DrawCard from '../../drawcard.js';

class WhatIsDeadMayNeverDie extends DrawCard {
    // What Is Dead May Never Die (12023)
    // Reaction: After you win dominance, choose a [greyjoy] character in your dead pile and put it
    // into play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event) => this.controller === event.winner
            },
            target: {
                cardCondition: (card) => this.cardCondition(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} plays {1} to put {2} into play from their dead pile',
                    context.player,
                    this,
                    context.target
                );
            }
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
