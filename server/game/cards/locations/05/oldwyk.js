const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class OldWyk extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallenge: (event, challenge) =>
                    challenge.attackingPlayer === this.controller &&
                    challenge.challengeType === 'power' &&
                    this.anyDrownedGodInDeadPile()
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let card = _.last(this.controller.deadPile.filter(c => c.hasTrait('Drowned God')));

                this.controller.putIntoPlay(card);
                this.game.currentChallenge.addAttacker(card);

                this.game.addMessage('{0} kneels {1} to put {2} into play from their dead pile as an attacker', 
                                      this.controller, this, card);

                this.game.once('afterChallenge', (event, challenge) => this.resolveAfterChallenge(challenge, card));
            }
        });
    }

    resolveAfterChallenge(challenge, card) {
        if(challenge.winner === this.controller && challenge.strengthDifference >= 5) {
            this.controller.returnCardToHand(card);
            this.game.addMessage('{0} is returned to {1}\'s hand because of {2}',
                                  card, this.controller, this);

            return;
        }

        this.controller.moveCard(card, 'draw deck', { bottom: true });
        this.game.addMessage('{0} is placed on the bottom of {1}\'s deck because of {2}',
                              card, this.controller, this);
    }

    anyDrownedGodInDeadPile() {
        return this.controller.allCards.any(card => card.location === 'dead pile' && card.hasTrait('Drowned God'));
    }
}

OldWyk.code = '05028';

module.exports = OldWyk;
