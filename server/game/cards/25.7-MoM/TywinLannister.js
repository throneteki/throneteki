const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TywinLannister extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1
        });
        
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isAttacking()
            },
            message: {
                format: '{player} uses {source} to have {source} gain {amount} power',
                args: { amount: context => this.getPowerAmount(context) }
            },
            gameAction: GameActions.gainPower(context => ({ card: this, amount: this.getPowerAmount(context) }))
        });
    }

    getPowerAmount(context) {
        return Math.floor(context.player.gold / 2);
    }
}

TywinLannister.code = '25525';
TywinLannister.version = '1.0';

module.exports = TywinLannister;
