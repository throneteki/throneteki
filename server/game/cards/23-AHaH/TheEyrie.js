const DrawCard = require('../../drawcard');

class TheEyrie extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: -2,
            reserve: 2
        });

        this.persistentEffect({
            condition: () => !this.kneeled && this.controller.getTotalInitiative() !== 0,
            targetController: 'any',
            effect: ability.effects.increaseCost({
                amount: 1,
                playingTypes: ['marshal', 'ambush', 'play'],
                match: card => card.isFaction(card.controller.faction.getPrintedFaction()),
                limit: ability.limit.perPhase(1)
            })
        });
        this.persistentEffect({
            condition: () => !this.kneeled && this.controller.getTotalInitiative() === 0,
            targetController: 'any',
            effect: ability.effects.increaseCost({
                amount: 2,
                playingTypes: ['marshal', 'ambush', 'play'],
                match: card => card.isFaction(card.controller.faction.getPrintedFaction()),
                limit: ability.limit.perPhase(1)
            })
        });

        this.interrupt({
            when: {
                onInitiativeDetermined: event => event.winner !== this.controller
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} uses and kneels {source} to win initiative',
            handler: context => {
                context.event.winner = context.player;
            }
        });
    }
}

TheEyrie.code = '23031';

module.exports = TheEyrie;
