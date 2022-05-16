const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class RandyllTarly extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Army or reveal top card',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(card => card.getType() === 'location' && card.hasTrait('The Reach')),
            handler: context => {
                this.context = context;

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Choose one',
                        buttons: [
                            { text: 'Stand an Army', method: 'standArmy' },
                            { text: 'Reveal top card', method: 'revealtopcard' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    standArmy() {
        this.game.promptForSelect(this.context.player, {
            activePromptTitle: 'Select an Army',
            source: this,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Army') && card.kneeled,
            gameAction: 'stand',
            onSelect: (player, card) => this.onArmySelected(player, card),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    revealtopcard() {
        const gameAction = GameActions.revealTopCards(context => ({
            player: context.player
        })).then({
            message: '{player} {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.ifCondition({
                    condition: context => context.event.cards[0].isMatch({
                        type: 'location',
                        trait: 'The Reach'
                    }),
                    thenAction: GameActions.putIntoPlay(context => ({
                        card: context.event.cards[0]
                    }))
                }),
                GameActions.ifCondition({
                    condition: context => context.event.cards[0].isMatch({
                        type: 'location',
                        not: { trait: 'The Reach' }
                    }),
                    thenAction: GameActions.drawCards(context => ({
                        player: context.player,
                        amount: 1
                    }))
                })
            ])
        });

        this.game.addMessage('{0} uses {1} and kneels {2} to reveal the top card of their deck', this.context.player, this.context.source, this.context.costs.kneel);
        this.game.resolveGameAction(gameAction, this.context);
        return true;
    }

    onArmySelected(player, card) {
        card.controller.standCard(card);
        this.game.addMessage('{0} uses {1} to kneel {2} and stand {3}', player, this, this.context.costs.kneel, card);

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }
}

RandyllTarly.code = '19015';

module.exports = RandyllTarly;
