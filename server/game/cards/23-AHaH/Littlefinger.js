const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');
const Messages = require('../../Messages');

class Littlefinger extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating()
            },
            message: '{player} uses {source} to have each player choose and reveal 1 card from their hand or shadows area',
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) => ['hand', 'shadows'].includes(card.location) && card.controller === context.choosingPlayer,
                gameAction: 'reveal',
                messages: Messages.eachPlayerSecretTargetingForCardType('card in hand/shadows')
            },
            limit: ability.limit.perPhase(1),
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.revealCards(context => ({
                        cards: context.targets.getTargets()
                    })).then({
                        gameAction: GameActions.ifCondition({
                            condition: context => this.noOpponentRevealedSameCardtype(context.player, context.parentContext.revealed),
                            thenAction: GameActions.genericHandler(context => {
                                this.game.promptForSelect(context.player, {
                                    activePromptTitle: 'Select a card',
                                    source: this,
                                    cardCondition: card => card.getPower() > 0,
                                    cardType: ['attachment', 'character', 'faction', 'location'],
                                    gameAction: 'movePower',
                                    onSelect: (player, card) => this.onSelectCard(player, card),
                                    onCancel: (player) => this.onSelectCard(player, null)
                                });
                            })
                        })
                    }),
                    context
                );
            }
        });
    }

    onSelectCard(player, card) {
        if(card === null) {
            this.game.addAlert('danger', '{0} does not choose any card for {1}', player, this);
            return true;
        }

        this.game.resolveGameAction(
            GameActions.movePower({
                from: card,
                to: this,
                amount: 1
            })
        );
        this.game.addMessage('{0} moves 1 power from {1} to {2}', player, card, this);
        return true;
    }

    noOpponentRevealedSameCardtype(player, revealed) {
        return revealed.every(card1 => card1.controller === player || revealed.every(card2 => card1 === card2 || card1.getType() !== card2.getType()));
    }
}

Littlefinger.code = '23018';

module.exports = Littlefinger;
