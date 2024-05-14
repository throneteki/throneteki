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

    message({ player, context }) {
        player = player || context.player;
        if (context.revealed) {
            let controllers = [...new Set(context.revealed.map((card) => card.controller))];
            let controllerGroups = controllers.map((controller) => ({
                player: controller,
                cards: context.revealed.filter((card) => card.controller === controller),
                locations: [
                    ...new Set(
                        context.revealed
                            .filter((card) => card.controller === controller)
                            .map((card) => card.location)
                    )
                ]
            }));

            if (player) {
                // Single player revealing all of the cards (theirs & opponents)
                let messageFragments = controllerGroups.map((group) =>
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
        return '';
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
        context.revealingPlayer = player;
        const allPlayers = context.game.getPlayers();
        const eventParams = {
            player,
            cards,
            revealWithMessage,
            highlight,
            source: source || context.source
        };
        return this.event('onCardsRevealed', eventParams, (event) => {
            const whileRevealedGameAction = whileRevealed || this.defaultWhileRevealed;
            const revealFunc = (card) => event.revealed.includes(card);

            event.revealed = context.revealed = event.cards.filter(
                (card) => !this.isImmune({ card, context })
            );

            // Make cards visible & print reveal message before 'onCardRevealed' to account for any reveal interrupts (eg. Alla Tyrell)
            context.game.cardVisibility.addRule(revealFunc);
            this.highlightRevealedCards(event, event.revealed, allPlayers);
            // TODO: Maybe remove these messages entirely, and ensure that reveal messages is only handled by the message function (eg. '{player} {gameAction}').
            //       Search GameAction likely needs edits for that. Once done, remove 'revealWithMessage'
            if (event.revealWithMessage) {
                let abilityMessage = AbilityMessage.create({
                    format: '{player} {revealAction}',
                    args: {
                        revealAction: (context) => this.message({ player: event.player, context })
                    }
                });
                abilityMessage.output(context.game, context);
            }

            for (let card of event.revealed) {
                const revealEventParams = {
                    card,
                    cardStateWhenRevealed: card.createSnapshot(),
                    player: event.player,
                    source: event.source
                };

                event.thenAttachEvent(
                    this.event('onCardRevealed', revealEventParams, (revealEvent) => {
                        if (
                            revealEvent.card.location !== revealEvent.cardStateWhenRevealed.location
                        ) {
                            event.revealed = context.revealed = context.revealed.filter(
                                (reveal) => reveal !== card
                            );
                            for (let player of allPlayers) {
                                player.setSelectableCards(event.revealed);
                            }
                        }
                    })
                );
            }
            let finalEvent = event;
            // Only create whileRevealed if cards are being highlighted. Otherwise, they are likely passively revealed
            if (event.highlight) {
                finalEvent = whileRevealedGameAction.createEvent(context);
                event.thenAttachEvent(finalEvent);
            }

            finalEvent.thenExecute(() => {
                this.hideRevealedCards(event, allPlayers);
                context.game.cardVisibility.removeRule(revealFunc);
            });
        });
    }

    highlightRevealedCards(event, cards, players) {
        if (event.highlight) {
            event.preRevealSelections = {};
            for (let player of players) {
                event.preRevealSelections[player.name] = {
                    selectedCards: player.getSelectedCards(),
                    selectableCards: player.getSelectableCards()
                };

                player.clearSelectedCards();
                player.clearSelectableCards();
                player.setSelectableCards(cards);
            }
        }
    }

    hideRevealedCards(event, players) {
        if (event.highlight) {
            for (let player of players) {
                player.clearSelectedCards();
                player.clearSelectableCards();
                player.setSelectedCards(event.preRevealSelections[player.name].selectedCards);
                player.setSelectableCards(event.preRevealSelections[player.name].selectableCards);
            }
            event.preRevealSelections = null;
        }
    }
}

export default new RevealCards();
