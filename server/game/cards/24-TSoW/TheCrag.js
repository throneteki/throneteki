const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheCrag extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.cannotInitiateChallengeType('intrigue')
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ challengeType: 'military', winner: this.controller, attackingPlayer: this.controller })
            },
            limit: ability.limit.perPhase(2),
            message: {
                format: '{player} uses {source} to gain {amount} power for their faction',
                args: { amount: context => this.getAmount(context) }
            },
            gameAction: GameActions.gainPower(context => ({ card: context.player.faction, amount: this.getAmount(context) }))
        });
    }

    getAmount(context) {
        return context.player.anyCardsInPlay(card => card.isFaction('stark') && card.hasTrait('King')) ? 2 : 1;
    }
}

TheCrag.code = '24018';

module.exports = TheCrag;
