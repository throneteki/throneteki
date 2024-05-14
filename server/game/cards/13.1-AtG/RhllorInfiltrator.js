const DrawCard = require('../../drawcard');

class RhllorInfiltrator extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give control and gain 1 power',
            phase: 'dominance',
            condition: () => this.controller.canGainFactionPower(),
            chooseOpponent: true,
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to give control of {source} to {opponent} and gain 1 power',
                args: { opponent: (context) => context.opponent }
            },
            handler: (context) => {
                this.game.takeControl(context.opponent, this);
                this.game.addPower(context.player, 1);
            }
        });
    }
}

RhllorInfiltrator.code = '13007';

module.exports = RhllorInfiltrator;
