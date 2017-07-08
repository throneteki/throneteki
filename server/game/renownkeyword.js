const BaseAbility = require('./baseability.js');

class RenownKeyword extends BaseAbility {
    constructor() {
        super({});
        this.title = 'Renown';
    }

    meetsRequirements() {
        return true;
    }

    isCardAbility() {
        return false;
    }

    executeHandler(context) {
        let {game, challenge, source} = context;

        game.applyGameAction('gainPower', source, card => {
            card.modifyPower(1);
            game.raiseEvent('onRenown', challenge, card);
            game.addMessage('{0} gains 1 power on {1} from Renown', challenge.winner, card);
        });
    }
}

module.exports = RenownKeyword;
