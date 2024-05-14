const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Rhaegal extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.winner && this.isAttacking()
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.kneeled &&
                    card.controller === this.controller &&
                    card !== this,
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game
                    .resolveGameAction(GameActions.standCard({ card: context.target }))
                    .thenExecute(() => {
                        if (
                            context.target.hasTrait('Dragon') ||
                            context.target.hasTrait('Stormborn')
                        ) {
                            this.game.resolveGameAction(GameActions.standCard({ card: this }));
                            this.game.addMessage('Then {0} stands {1}', context.player, this);
                        }
                    });
            }
        });
    }
}

Rhaegal.code = '15003';

module.exports = Rhaegal;
