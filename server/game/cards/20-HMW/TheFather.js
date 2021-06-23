const PlotCard = require('../../plotcard');
const GameActions = require('../../GameActions');

class TheFather extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseEnded: event => event.phase === 'dominance' && this.game.anyCardsInPlay(card => card.getType() === 'character' && card.isUnique())
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.isUnique(),
                mode: 'eachPlayer',
                gameAction: 'returnToHand'
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map(card => GameActions.returnCardToHand({ card }))
                    ),
                    context
                );
                this.game.addMessage('{0} uses {1} to return {2} to its owner\'s hands',
                    context.player, this, context.target);
            }
        });
    }
}

TheFather.code = '20054';

module.exports = TheFather;
