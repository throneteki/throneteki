const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class HostOfTheVale extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ defendingPlayer: this.controller }),
            location: 'any',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', () => this.game.currentChallenge.attackingPlayer.getTotalInitiative())
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.defenders.some(card => card.controller === this.controller && card.hasTrait('House Arryn') && card.hasTrait('Knight') && card.getType() === 'character')
            },
            cost: ability.costs.returnToHand(card => card.isDefending() && card.hasTrait('House Arryn') && card.hasTrait('Knight')),
            message: {
                format: '{player} uses {source} and returns {returnToHand} to their hand to gain 1 power for their faction',
                args: { returnToHand: context => context.costs.returnToHand }
            },
            gameAction: GameActions.gainPower(context => ({ card: context.player.faction }))
        });
    }
}

HostOfTheVale.code = '23017';

module.exports = HostOfTheVale;
