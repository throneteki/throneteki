const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');
const Messages = require('../../Messages');

class Littlefinger extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating()
            },
            message: {
                format: '{player} uses {source} to have each player choose and reveal 1 card from their hand or shadows area'
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) => ['hand', 'shadows'].includes(card.location) && card.controller === context.choosingPlayer,
                gameAction: 'reveal',
                messages: Messages.eachPlayerSecretTargetingForCardType('cards in hand/shadows')
            },
            limit: ability.limit.perPhase(1),
            handler: context => {
                let cards = context.targets.selections.map(selection => selection.value).filter(card => !!card);
                this.game.resolveGameAction(
                    GameActions.simultaneously(cards.map(card => GameActions.revealCard({ card })))
                );
                let playerCardType = cards.filter(card => card.owner === context.player)[0].getPrintedType();
                let otherCardTypes = cards.filter(card => card.owner !== context.player).map(card => card.getPrintedType());
                if(!otherCardTypes.includes(playerCardType)) {
                    this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Select a card',
                        source: this,
                        cardCondition: card => card.getPower() > 0,
                        cardType: ['attachment', 'character', 'faction', 'location'],
                        gameAction: 'movePower',
                        onSelect: (player, card) => this.onSelectCard(player, card),
                        onCancel: (player) => this.onSelectCard(player, null)
                    });
                }
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
        this.game.addMessage('{0} uses {1} to move 1 power from {2} to {1}', player, this, card);
        return true;
    }
}

Littlefinger.code = '23018';

module.exports = Littlefinger;
