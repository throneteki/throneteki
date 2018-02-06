const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class OldWyk extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.attackingPlayer === this.controller &&
                                               event.challenge.challengeType === 'power' &&
                                               this.anyDrownedGodInDeadPile()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let card = _.last(this.controller.deadPile.filter(c => c.hasTrait('Drowned God')));

                this.controller.putIntoPlay(card, 'play', { kneeled: true });
                this.game.currentChallenge.addAttacker(card);

                this.game.addMessage('{0} kneels {1} to put {2} into play from their dead pile knelt as an attacker',
                    this.controller, this, card);

                this.game.once('afterChallenge', event => this.resolveAfterChallenge(event.challenge, card));
            }
        });
    }

    resolveAfterChallenge(challenge, card) {
        if(card.location !== 'play area') {
            return;
        }

        if(challenge.winner === this.controller && challenge.strengthDifference >= 5) {
            this.controller.returnCardToHand(card);
            this.game.addMessage('{0} is returned to {1}\'s hand because of {2}',
                card, this.controller, this);

            return;
        }

        this.game.placeOnBottomOfDeck(card);
        this.game.addMessage('{0} is placed on the bottom of {1}\'s deck because of {2}',
            card, this.controller, this);
    }

    anyDrownedGodInDeadPile() {
        return this.controller.deadPile.any(card => card.hasTrait('Drowned God'));
    }
}

OldWyk.code = '05028';

module.exports = OldWyk;
