const DrawCard = require('../../drawcard');

class TheEyrie extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2,
            reserve: 2
        });

        this.persistentEffect({
            condition: () => !this.kneeled,
            targetController: 'current',
            match: card => card.controller === this.controller && card.hasTrait('House Arryn') && card.isUnique(),
            effect: ability.effects.dynamicStrength(() => this.power)
        });

        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            cost: ability.costs.kneelSelf(),
            choosePlayer: true,
            handler: context => {
                this.game.setFirstPlayer(context.chosenPlayer);
                this.game.addMessage('{0} kneels {1} to have {2} become first player', context.player, this, context.chosenPlayer);
            }
        });

        this.interrupt({
            //limit once per round so you can´t cancel the cancel with another power
            limit: ability.limit.perRound(1),
            //TODO this only works in joust, not in meelee
            player: () => this.game.getOpponents(this.controller)[0],
            when: {
                onCardAbilityInitiated: event => event.ability.isTriggeredAbility() &&
                                                 event.source === this &&
                                                 event.source.controller === this.controller
            },
            cost: ability.costs.movePowerFromCardToFixedTarget({
                target: this,
                amount: 1,
                condition: (card, context) => ((card.controller === context.player && card.location === 'play area') || card === context.player.faction) && card.power > 0
            }),
            handler: context => {
                context.event.cancel();
                this.game.addMessage('{0} moves 1 power from {1} to {2} to cancel {2}', context.player, context.costs.movePowerFromCard, this, context.event.source);
            }
        });
    }
}

TheEyrie.code = '23031';

module.exports = TheEyrie;
