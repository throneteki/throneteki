const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class MaegeMormont extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.hasParticipatingMormont()
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards(context => ({
                player: context.player
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: context => context.event.cards[0].isFaction('stark'),
                    thenAction: GameActions.drawCards(context => ({
                        player: context.player,
                        amount: 1
                    }))
                })
            })
        });
    }

    hasParticipatingMormont() {
        return this.controller.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('House Mormont'));
    }
}

MaegeMormont.code = '08021';

module.exports = MaegeMormont;
