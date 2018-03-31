const BaseAbility = require('./baseability.js');

class InsightKeyword extends BaseAbility {
    constructor() {
        super({});
        this.title = 'Insight';
    }

    meetsRequirements(context) {
        return context.challenge.winner.canDraw();
    }

    executeHandler(context) {
        let {game, challenge, source} = context;
        let drawn = (challenge.winner.drawCardsToHand(1))[0];
        game.raiseEvent('onInsight', { challenge: challenge, source: source, card: drawn });
        game.addMessage('{0} draws a card from Insight on {1}', challenge.winner, source);
    }
}

module.exports = InsightKeyword;
