const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');
const Messages = require('../../Messages');

class Littlefinger extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller
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
                    this.game.addMessage('{0} uses {1} to stand {1} and have him gain 1 power', context.player, this);
                    context.player.standCard(this);
                    this.modifyPower(1);
                }
            }
        });
    }
}

Littlefinger.code = '23018';

module.exports = Littlefinger;
