const DrawCard = require('../../drawcard');

class MaidensBane extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, unopposed: true })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            handler: (context) => {
                context.player.standCard(context.target);

                if (context.target.hasTrait('Captain')) {
                    this.game.addMessage('Then {0} stands {1}', context.player, this);
                    context.player.standCard(this);
                }
            }
        });
    }
}

MaidensBane.code = '12019';

module.exports = MaidensBane;
