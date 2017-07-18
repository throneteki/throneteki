const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JonSnow extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isParticipating(this)
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                let affectedCharacters = [];
                if(this.game.currentChallenge.attackingPlayer === this.controller) {
                    affectedCharacters = this.controller.filterCardsInPlay(card => this.game.currentChallenge.isAttacking(card) &&
                                                                                   card.hasTrait('Wildling') &&
                                                                                   card.getType() === 'character');
                } else {
                    affectedCharacters = this.controller.filterCardsInPlay(card => this.game.currentChallenge.isDefending(card) &&
                                                                                   card.isFaction('thenightswatch') &&
                                                                                   card.getType() === 'character');
                }

                _.each(affectedCharacters, card => {
                    card.controller.standCard(card);
                });

                this.game.addMessage('{0} uses {1} to stand {2}', this.controller, this, affectedCharacters);
            }
        });
    }
}

JonSnow.code = '07001';

module.exports = JonSnow;
