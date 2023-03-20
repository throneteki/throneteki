const BaseAbility = require('./baseability.js');
const GameActions = require('./GameActions');

class PillageKeyword extends BaseAbility {
    constructor() {
        super({
            gameAction: GameActions.discardTopCards(context => ({
                player: context.challenge.loser,
                amount: this.getAmount(context.source),
                isPillage: true,
                source: context.source
            })).thenExecute(event => {
                event.source.game.addMessage('{0} discards {1} from the top of their deck due to Pillage on {2}', event.player, event.topCards, event.source);
            })
        });
        this.title = 'Pillage';
    }

    getAmount(source) {
        return 1 + source.getKeywordTriggerModifier(this.title);
    }
}

module.exports = PillageKeyword;
