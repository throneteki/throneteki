const DrawCard = require('../../drawcard.js');

class Shandystone extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.defendingPlayer === this.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    card.kneeled,
                gameAction: 'stand'
            },
            handler: (context) => {
                context.player.standCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

Shandystone.code = '08076';

module.exports = Shandystone;
