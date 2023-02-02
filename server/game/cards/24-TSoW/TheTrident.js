const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheTrident extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            claim: 1
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(() => true)
        });
        this.forcedReaction({
            cannotBeCanceled: true,
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.attackingPlayer === this.controller
            },
            target: {
                cardCondition: { type: 'location', trait: ['The Riverlands', 'Westeros'], controller: 'current' }
            },
            message: '{player} is forced to sacrifice {target} for {source}',
            handler: context => {
                this.game.resolveGameAction(GameActions.sacrificeCard(context => ({ card: context.target })), context);
            }
        });
    }
}

TheTrident.code = '24028';

module.exports = TheTrident;
