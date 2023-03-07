const BaseAbility = require('./baseability.js');

class PillageKeyword extends BaseAbility {
    constructor() {
        super({});
        this.title = 'Pillage';
    }

    meetsRequirements() {
        return true;
    }

    executeHandler(context) {
        let {game, challenge, source} = context;
        // Keyword modifier adjusts the number of cards discarded for pillage
        let amount = 1 + source.getKeywordLimitModifier('pillage');
        game.raiseEvent('onPillage', { source: source, numCards: amount }, event => {
            challenge.loser.discardFromDraw(event.numCards, cards => {
                game.addMessage('{0} discards {1} from the top of their deck due to Pillage from {2}', challenge.loser, cards, source);
            }, { isPillage: true, source: source });
        });
    }
}

module.exports = PillageKeyword;
