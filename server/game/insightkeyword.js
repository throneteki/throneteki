const BaseAbility = require('./baseability');
const GameActions = require('./GameActions');

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
        game.addMessage('{0} draws a card from Insight on {1}', challenge.winner, source);
        game.resolveGameAction(
            GameActions.drawCards({
                player: challenge.winner,
                amount: 1,
                reason: 'insight',
                source
            })
        );
    }
}

module.exports = InsightKeyword;
