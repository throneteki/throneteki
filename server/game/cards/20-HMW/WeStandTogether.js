const DrawCard = require('../../drawcard');

class WeStandTogether extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    card.kneeled &&
                    card.hasTrait('House Frey'),
                gameAction: 'stand'
            },
            handler: (context) => {
                if (context.event.challenge.number === 3) {
                    let affectedCharacters = [];
                    affectedCharacters = context.player.filterCardsInPlay(
                        (card) =>
                            card.isAttacking() &&
                            card.hasTrait('House Frey') &&
                            card.getType() === 'character'
                    );
                    for (let card of affectedCharacters) {
                        card.controller.standCard(card);
                    }
                    this.game.addMessage(
                        '{0} uses {1} to stand {2}',
                        context.player,
                        this,
                        affectedCharacters
                    );
                } else {
                    context.player.standCard(context.target);
                    this.game.addMessage(
                        '{0} uses {1} to stand {2}',
                        context.player,
                        this,
                        context.target
                    );
                }
            }
        });
    }
}

WeStandTogether.code = '20050';

module.exports = WeStandTogether;
