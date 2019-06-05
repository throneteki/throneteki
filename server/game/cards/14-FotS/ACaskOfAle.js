const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class ACaskOfAle extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, challengeType: 'power' })
            },
            targets: {
                from: {
                    activePromptTitle: 'Select card with power',
                    cardCondition: card => ['active plot', 'faction', 'play area'].includes(card.location) && card.power > 0,
                    cardType: ['attachment', 'character', 'faction', 'location', 'plot']
                },
                to: {
                    activePromptTitle: 'Select card to place power',
                    cardCondition: (card, context) => (
                        ['active plot', 'faction', 'play area'].includes(card.location) &&
                        (!context.targets.from || card !== context.targets.from && card.controller === context.targets.from.controller)
                    ),
                    cardType: ['attachment', 'character', 'faction', 'location', 'plot']
                }
            },
            handler: context => {
                this.context = context;
                if(context.targets.from.power > 1) {
                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: 'Choose amount of power',
                            buttons: [
                                { text: '2', arg: 2, method: 'selectPowerAmount' },
                                { text: '1', arg: 1, method: 'selectPowerAmount' }
                            ]
                        },
                        source: this
                    });
                    return;
                }

                this.selectPowerAmount(context.player, 1);
            }
        });
    }

    selectPowerAmount(player, amount) {
        this.game.addMessage('{0} plays {1} to move {2} power from {3} to {4}', this.context.player, this, amount, this.context.targets.from, this.context.targets.to);

        this.game.resolveGameAction(
            GameActions.movePower(context => ({
                from: context.targets.from,
                to: context.targets.to,
                amount
            })),
            this.context
        );

        return true;
    }
}

ACaskOfAle.code = '14023';

module.exports = ACaskOfAle;
