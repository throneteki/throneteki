const BaseAbility = require('./baseability.js');
const GameActions = require('./GameActions');

class RenownKeyword extends BaseAbility {
    constructor() {
        super({
            message: {
                format: '{player} gains {amount} power on {source} from Renown',
                args: { amount: context => this.getAmount(context.source) }
            },
            gameAction: GameActions.gainPower(context => ({
                card: context.source,
                amount: this.getAmount(context.source),
                reason: 'renown',
                source: context.source
            }))
        });
        this.title = 'Renown';
    }

    getAmount(source) {
        return 1 + source.getKeywordTriggerModifier(this.title);
    }
}

module.exports = RenownKeyword;
