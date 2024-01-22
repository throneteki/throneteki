const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TywinLannister extends DrawCard {
    setupCardAbilities(ability) {        
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating()
            },
            message: {
                format: '{player} uses {source} to have {source} gain {amount} power',
                args: { amount: context => this.getPowerAmount(context) }
            },
            limit: ability.limit.perRound(1),
            gameAction: GameActions.gainPower(context => ({ card: this, amount: this.getPowerAmount(context) }))
        });
    }

    getPowerAmount(context) {
        return Math.floor(context.player.gold / 3);
    }
}

TywinLannister.code = '25525';
TywinLannister.version = '1.3';

module.exports = TywinLannister;
