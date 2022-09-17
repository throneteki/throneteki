const { context } = require('raven');
const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const Message = require('../../Message');

class TheBloodyGate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        defendingPlayer: context.player,
                        loser: context.player,
                        challengeType: 'military',
                        match: challenge => challenge.defenders.some(card => card.hasTrait('House Arryn')
                            && card.controller === context.player)
                            && challenge.winner.hand.length > 0
                    })
            },
            message: {
                format: '{player} uses {source} to {potentialAction}',
                args: { 
                    potentialAction: context => {
                        let message = this.kneeled ? 'discard a card at random from {winner}\'s hand' : 'have {winner} choose and discard a card from their hand';
                        return Message.fragment(message, { winner: context.event.challenge.winner });
                    }
                }
            },
            gameAction: GameActions.ifCondition({
                condition: () => this.kneeled,
                thenAction: GameActions.discardAtRandom(context => ({
                    player: context.event.challenge.winner
                })),
                elseAction: GameActions.genericHandler(context => {
                    this.game.promptForSelect(context.event.challenge.winner, {
                        activePromptTitle: 'Select a card',
                        source: this,
                        cardCondition: card => card.location === 'hand' && card.controller === context.event.challenge.winner,
                        onSelect: (player, card) => this.onCardSelected(player, card)
                    });
                })
            })
        });
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} chooses to discard {1} from their hand', card.controller, card);
        this.game.resolveGameAction(GameActions.discardCard({ card, source: this }), context);
        return true;
    }
}

TheBloodyGate.code = '23032';

module.exports = TheBloodyGate;
