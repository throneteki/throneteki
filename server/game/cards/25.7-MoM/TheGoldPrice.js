const AgendaCard = require('../../agendacard');
const GameActions = require('../../GameActions');

class TheGoldPrice extends AgendaCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: event => event.card.getType() === 'character' && event.card.owner !== this.controller && event.originalLocation === 'hand'
            },
            message: {
                format: '{player} uses {source} to put {card} into play instead of placing it in {opponent}\'s discard pile',
                args: { card: context => context.event.card, opponent: context => context.event.card.owner }
            },
            handler: context => {
                context.event.replaceHandler(event => {
                    event.thenAttachEvent(GameActions.putIntoPlay({ player: context.player, card: context.event.card }).createEvent());
                    this.game.once('onAtEndOfPhase', () => {
                        const prompt = new PayOrSacrificePrompt({
                            card: context.event.card,
                            game: this.game,
                            player: context.player,
                            source: context.source
                        });
                        prompt.resolve();
                    });
                });
            }
        });
    }
}
class PayOrSacrificePrompt {
    constructor({ card, player, game, source }) {
        this.card = card;
        this.player = player;
        this.game = game;
        this.source = source;
    }

    resolve() {
        if(this.player.getSpendableGold() >= this.card.getCost()) {
            this.game.promptWithMenu(this.player, this, {
                activePrompt: {
                    menuTitle: `Keep ${this.card.name}?`,
                    buttons: [
                        { text: `Pay ${this.card.getCost()} gold`, method: 'resolvePay' },
                        { text: 'Sacrifice', method: 'resolveSacrifice' }
                    ]
                },
                source: this.source
            });
        } else {
            this.resolveSacrifice();
        }
    }

    resolvePay() {
        this.game.addMessage('{0} pays {1} to keep {2} for {3}', this.player, this.card.getCost(), this.card, this.source);
        this.game.spendGold({ amount: this.card.getCost(), player: this.player });
        return true;
    }

    resolveSacrifice() {
        this.game.addMessage('{0} sacrifices {1} for {2}', this.player, this.card, this.source);
        this.game.resolveGameAction(GameActions.sacrificeCard({ card: this.card }));
        return true;
    }
}

TheGoldPrice.code = '25619';
TheGoldPrice.version = '1.0';

module.exports = TheGoldPrice;
