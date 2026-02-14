import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TheGoldPrice extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay']);
    }

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.owner !== this.controller &&
                    event.originalLocation === 'hand' &&
                    event.isRandom
            },
            message: {
                format: '{player} uses {source} to put {card} into play under their control',
                args: { card: (context) => context.event.card }
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.event.card
            })).thenExecute((event) => {
                let context = this.game.currentAbilityContext;
                this.game.once('onAtEndOfPhase', () => {
                    if (['play area', 'duplicate'].includes(event.card.location)) {
                        const prompt = new PayOrSacrificePrompt({
                            card: event.card,
                            game: this.game,
                            player: context.player,
                            source: context.source
                        });
                        prompt.resolve();
                    }
                });
            })
        });
    }

    onCardEntersPlay(event) {
        if (
            this.game.currentPhase !== 'setup' &&
            event.card.controller === this.controller &&
            event.card.getType() === 'location'
        ) {
            this.game.addMessage('{0} enters play knelt due to {1}', event.card, this);
            event.card.kneeled = true;
        }
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
        if (this.player.getSpendableGold() >= this.card.translateXValue(this.card.getPrintedCost())) {
            this.game.promptWithMenu(this.player, this, {
                activePrompt: {
                    menuTitle: `Keep ${this.card.name}?`,
                    buttons: [
                        { text: `Pay ${this.card.translateXValue(this.card.getPrintedCost())} gold`, method: 'resolvePay' },
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
        this.game.addMessage(
            '{0} pays {1} to keep {2} for {3}',
            this.player,
            this.card.translateXValue(this.card.getPrintedCost()),
            this.card,
            this.source
        );
        this.game.spendGold({ amount: this.card.translateXValue(this.card.getPrintedCost()), player: this.player });
        return true;
    }

    resolveSacrifice() {
        this.game.addMessage('{0} sacrifices {1} for {2}', this.player, this.card, this.source);
        this.game.resolveGameAction(GameActions.sacrificeCard({ card: this.card }));
        return true;
    }
}

TheGoldPrice.code = '25040';

export default TheGoldPrice;
