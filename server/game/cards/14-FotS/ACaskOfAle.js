const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class ACaskOfAle extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => (event.challenge.isMatch({ winner: this.controller, challengeType: 'power' }) 
                    && this.game.allCards.some(card => (card.location === 'active plot', 'faction', 'play area' && card.getPower() > 0)))
            },
            target: {
                mode: 'exactly',
                numCards: 2,
                activePromptTitle: 'Select 2 cards',
                singleController: true,
                cardCondition: card => ['active plot', 'faction', 'play area'].includes(card.location),
                cardType: ['attachment', 'character', 'faction', 'location', 'plot'],
                gameAction: 'movePower'
            },
            handler: context => {
                this.context = context;
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select card with power',
                    source: this,
                    cardCondition: card => context.target.includes(card) && card.getPower() > 0,
                    cardType: ['attachment', 'character', 'faction', 'location', 'plot'],
                    onSelect: (player, card) => this.fromCardSelected(player, card),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }
    fromCardSelected(player, fromCard) {
        this.fromCard = fromCard;
        this.toCard = this.context.target.find(card => card !== fromCard);

        if(fromCard.power > 1) {
            this.game.promptWithMenu(this.context.player, this, {
                activePrompt: {
                    menuTitle: 'Choose amount of power',
                    buttons: [
                        { text: '2', arg: 2, method: 'selectPowerAmount' },
                        { text: '1', arg: 1, method: 'selectPowerAmount' }
                    ]
                },
                source: this
            });
            return true;
        }

        this.selectPowerAmount(this.context.player, 1);

        return true;
    }

    selectPowerAmount(player, amount) {
        this.game.addMessage('{0} plays {1} to move {2} power from {3} to {4}', this.context.player, this, amount, this.fromCard, this.toCard);

        this.game.resolveGameAction(
            GameActions.movePower({
                from: this.fromCard,
                to: this.toCard,
                amount
            }),
            this.context
        );

        return true;
    }
    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);

        return true;
    }
}

ACaskOfAle.code = '14023';

module.exports = ACaskOfAle;
