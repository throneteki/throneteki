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
        game.addMessage('{0} draws {1} from Insight on {2}', challenge.winner, source.insightLimit > 1 ? source.insightLimit + ' cards' : 'a card', source);
        game.resolveGameAction(
            GameActions.drawCards({
                player: challenge.winner,
                amount: source.insightLimit,
                reason: 'insight',
                source
            })
        );
    }
}

module.exports = InsightKeyword;
