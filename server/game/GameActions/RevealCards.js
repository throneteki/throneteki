import GameAction from './GameAction.js';
import HandlerGameActionWrapper from './HandlerGameActionWrapper.js';
import AbilityMessage from '../AbilityMessage.js';
import AcknowledgeRevealCardsPrompt from '../gamesteps/AcknowledgeRevealCardsPrompt.js';
import Message from '../Message.js';

class RevealCards extends GameAction {
    constructor() {
        super('revealCards');
        this.defaultWhileRevealed = new HandlerGameActionWrapper({
            handler: (context) => {
                if (context.revealed.length > 0) {
                    // TODO: Replace the below with a separate Card Reveal UI (and don't show the cards in their respective locations). This would clean up effects which simply reveal a single card.
                    context.game.queueStep(
                        new AcknowledgeRevealCardsPrompt(
                            context.game,
                            context.revealed,
                            context.revealingPlayer,
                            context.source
                        )
                    );
                }
            }
        });
    }

    message({ player, cards, context }) {
        player = player || context.player;
        const controllers = [...new Set(cards.map((card) => card.controller))];
        const controllerGroups = controllers.map((controller) => ({
            player: controller,
            cards: cards.filter((card) => card.controller === controller),
            locations: [
                ...new Set(
                    cards
                        .filter((card) => card.controller === controller)
                        .map((card) => card.location)
                )
            ]
        }));

        if (player) {
            // Single player revealing all of the cards (theirs & opponents)
            const messageFragments = controllerGroups.map((group) =>
                Message.fragment(
                    `{cards} from ${group.player === player ? 'their' : "{player}'s"} {locations}`,
                    group
                )
            );
            return Message.fragment('reveals {messageFragments}', { messageFragments });
        }
        // Each player reveals their own cards individually
        return controllerGroups.map((group) =>
            Message.fragment('reveals {cards} from their {locations}', {
                cards: group.cards,
                locations: group.locations
            })
        );
    }

    allow({ cards, context }) {
        return cards.length > 0 && cards.some((card) => !this.isImmune({ card, context }));
    }

    createEvent({
        cards,
        player,
        whileRevealed,
        revealWithMessage = true,
        highlight = true,
        source,
        context
    }) {
        context.revealingPlayer = player || context.player;
        const eventParams = {
            player,
            cards,
            revealWithMessage,
            highlight,
            source: source || context.source
        };
        return this.event('onCardsRevealed', eventParams, (event) => {
            const whileRevealedGameAction = whileRevealed || this.defaultWhileRevealed;
            // Immune cards should still be visible, but not trigger a reveal event
            const visible = event.cards;
            const revealing = visible.filter((card) => !this.isImmune({ card, context }));

            // Make all valid targets visible + highlighted before actual reveal for cards with 'onCardRevealed' interrupts (eg. Alla Tyrell, Sweetrobin, etc.)
            context.preRevealFunc = (card) => visible.includes(card);
            context.game.cardVisibility.addRule(context.preRevealFunc);
            this.highlightCards(visible, context);

            // TODO: Maybe remove these messages entirely, and ensure that reveal messages is only handled by the message function (eg. '{player} {gameAction}').
            //       Search GameAction likely needs edits for that. Once done, remove 'revealWithMessage'
            if (event.revealWithMessage) {
                let abilityMessage = AbilityMessage.create({
                    format: '{revealPlayer} {revealAction}',
                    args: {
                        revealPlayer: () => event.player,
                        revealAction: (context) =>
                            this.message({ player: event.player, cards: revealing, context })
                    }
                });
                abilityMessage.output(context.game, context);
            }

            context.revealed = [];
            for (const card of revealing) {
                const revealEventParams = {
                    card,
                    cardStateWhenRevealed: card.createSnapshot(),
                    player: event.player,
                    source: event.source
                };

                event.thenAttachEvent(
                    this.event('onCardRevealed', revealEventParams, (event) => {
                        context.revealed.push(event.card);
                    })
                );
            }

            // Clear all pre-reveals, and re-reveal actually revealed cards.
            // Eg. A triggered "Alla Tyrell" will be pre-revealed, but not re-revealed
            event.thenAttachEvent(
                this.event('__PLACEHOLDER_EVENT__', {}, () => {
                    // Disable pre-reveals
                    context.game.cardVisibility.removeRule(context.preRevealFunc);
                    delete context.preRevealFunc;

                    // Enable actually revealed
                    context.revealFunc = (card) => context.revealed.includes(card);
                    context.game.cardVisibility.addRule(context.revealFunc);
                    this.highlightCards(context.revealed, context);
                })
            );
            // Only create whileRevealed if cards are being highlighted. Otherwise, they are likely passively revealed
            if (event.highlight) {
                event.thenAttachEvent(whileRevealedGameAction.createEvent(context));
            }

            // Finally, clear all regularly revealed cards
            event.thenExecute(() => {
                context.game.cardVisibility.removeRule(context.revealFunc);
                this.clearHighlightedCards(context);
                delete context.revealFunc;
            });
        });
    }

    highlightCards(cards, context) {
        for (const player of context.game.getPlayers()) {
            if (!context.playerSelections || !context.playerSelections[player.name]) {
                context.playerSelections = context.playerSelections ?? {};
                context.playerSelections[player.name] = {
                    selectedCards: player.getSelectedCards(),
                    selectableCards: player.getSelectableCards()
                };
            }
            player.clearSelectedCards();
            player.clearSelectableCards();
            player.setSelectableCards(cards);
        }
    }

    clearHighlightedCards(context) {
        if (context.playerSelections) {
            for (const player of context.game.getPlayers()) {
                player.clearSelectedCards();
                player.clearSelectableCards();
                player.setSelectedCards(context.playerSelections[player.name].selectedCards);
                player.setSelectableCards(context.playerSelections[player.name].selectableCards);
            }
            delete context.playerSelections;
        }
    }
}

export default new RevealCards();
