const DrawCard = require('../../drawcard.js');

class FalsePlans extends DrawCard {
    setupCardAbilities() {
        this.action({
            phase: 'challenge',
            chooseOpponent: (opponent) => opponent.hand.length !== 0,
            handler: (context) => {
                this.game.addMessage(
                    '{0} plays {1} to have {2} discard 1 card at random',
                    context.player,
                    this,
                    context.opponent
                );
                context.opponent.discardAtRandom(1);
            }
        });
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.card === this && this.isApplyingIntrigueClaimFromOpponent()
            },
            ignoreEventCosts: true,
            location: 'discard pile',
            handler: (context) => {
                let opponent = this.game.currentChallenge.winner;
                this.game.addMessage(
                    '{0} uses {1} to have {2} discard 2 cards at random',
                    context.player,
                    this,
                    opponent
                );
                opponent.discardAtRandom(2);
            }
        });
    }

    isApplyingIntrigueClaimFromOpponent() {
        return (
            this.game.claim.isApplying &&
            this.game.claim.type === 'intrigue' &&
            // In case intrigue claim is redirected back to the player,
            // e.g. via Vengeance for Elia, the card text specifies only
            // allowing it vs opponent's claim.
            this.game.currentChallenge &&
            this.game.currentChallenge.winner.hand.length !== 0 &&
            this.game.currentChallenge.winner !== this.controller
        );
    }
}

FalsePlans.code = '10023';

module.exports = FalsePlans;
