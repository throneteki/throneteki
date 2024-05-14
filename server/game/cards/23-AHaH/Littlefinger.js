const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');
const Messages = require('../../Messages');

class Littlefinger extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            message:
                '{player} uses {source} to have each player choose and reveal 1 card from their hand or shadows area',
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    ['hand', 'shadows'].includes(card.location) &&
                    card.controller === context.choosingPlayer,
                gameAction: 'reveal',
                messages: Messages.eachPlayerSecretTargetingForCardType('card in hand/shadows')
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealCards((context) => ({
                        cards: context.targets.getTargets()
                    })).then({
                        condition: (context) =>
                            this.noOpponentRevealedSameCardtype(
                                context.player,
                                context.event.cards
                            ),
                        target: {
                            activePromptTitle: 'Select a card',
                            cardCondition: (card) => card.getPower() > 0 && card !== this,
                            cardType: ['attachment', 'character', 'faction', 'location']
                        },
                        message: '{player} moves 1 power from {target} to {source}',
                        handler: (context) => {
                            this.game.resolveGameAction(
                                GameActions.movePower({
                                    from: context.target,
                                    to: this,
                                    amount: 1
                                }),
                                context
                            );
                        }
                    }),
                    context
                );
            }
        });
    }

    noOpponentRevealedSameCardtype(player, cards) {
        return cards.every(
            (card1) =>
                card1.controller === player ||
                cards.every((card2) => card1 === card2 || card1.getType() !== card2.getType())
        );
    }
}

Littlefinger.code = '23017';

module.exports = Littlefinger;
