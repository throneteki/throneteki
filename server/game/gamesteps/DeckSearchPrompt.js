import AbilityAdapter from '../GameActions/AbilityAdapter.js';
import BaseStep from './basestep.js';
import RevealCards from '../GameActions/RevealCards.js';

/**
 * Prompt that will search the player's deck, present them with matching cards,
 * them do something with the chosen card. Whether the player chooses a card or
 * cancels the prompt, their deck will be shuffled.
 *
 * The properties option object has the following properties:
 * numCards           - an integer specifying the number of cards that will be
 *                      searched within the player's deck. If not specified, the
 *                      entire deck will be searched.
 * numToSelect        - integer specifying the number of cards to select, default
 *                      is 1. If > 1, the onSelect callback (see below) will be
 *                      called multiple times, once for each selected card.
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * cardCondition      - a function that takes a card and should return a boolean
 *                      on whether that card is elligible to be selected.
 * cardType           - a string or array of strings listing which types of
 *                      cards can be selected. Defaults to the list of draw
 *                      card types.
 * additionalLocations - an optional array of other, non-draw-deck locations to
 *                      include in the search.
 * onSelect           - a callback that is called once the player chooses a
 *                      card.
 * onCancel           - a callback that is called when the player clicks the
 *                      done button without choosing a card.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 */
class DeckSearchPrompt extends BaseStep {
    constructor(game, choosingPlayer, properties) {
        super(game);

        this.choosingPlayer = choosingPlayer;
        this.properties = Object.assign({}, this.defaultProperties(), properties);
        if (!Array.isArray(this.properties.cardType)) {
            this.properties.cardType = [this.properties.cardType];
        }
    }

    defaultProperties() {
        return {
            additionalLocations: [],
            cardCondition: () => true,
            cardType: ['attachment', 'character', 'event', 'location'],
            onSelect: () => true,
            onCancel: () => true,
            reveal: true
        };
    }

    continue() {
        let context = { selectedCards: [], game: this.game, source: this.properties.source };
        let validCards = this.searchCards(context);
        let revealFunc = this.revealDrawDeckCards.bind(this);
        let modeProps = this.properties.numToSelect
            ? { mode: 'upTo', numCards: this.properties.numToSelect }
            : {};
        let revealGameAction = this.properties.reveal
            ? new AbilityAdapter(RevealCards, (context) => ({
                  cards: Array.isArray(context.result) ? context.result : [context.result],
                  player: context.player
              }))
            : null;

        this.game.cardVisibility.addRule(revealFunc);
        this.game.promptForSelect(
            this.choosingPlayer,
            Object.assign(modeProps, {
                activePromptTitle: this.properties.activePromptTitle,
                context: context,
                cardCondition: (card, context) =>
                    (validCards.includes(card) || this.inAdditionalLocation(card)) &&
                    this.checkCardCondition(card, context),
                onSelect: (player, result) => {
                    this.game.cardVisibility.removeRule(revealFunc);
                    if (revealGameAction) {
                        context.result = result;
                        context.player = this.choosingPlayer;
                        this.game
                            .resolveGameAction(revealGameAction, context)
                            .thenExecute((revealEvent) =>
                                this.evaluateOnSelect(player, result, revealEvent.revealed)
                            )
                            .thenExecute(() => this.queueShuffle());
                        return true;
                    }
                    this.properties.onSelect(player, result, result);
                    this.queueShuffle();
                    return true;
                },
                onCancel: (player, result) => {
                    this.game.cardVisibility.removeRule(revealFunc);
                    this.properties.onCancel(player, result);
                    this.queueShuffle();
                    return true;
                },
                source: this.properties.source
            })
        );
    }

    queueShuffle() {
        this.game.queueSimpleStep(() => {
            this.choosingPlayer.shuffleDrawDeck();
            this.game.addMessage('{0} shuffles their deck', this.choosingPlayer);
        });
    }

    evaluateOnSelect(player, searched, revealed) {
        // Filtering valid cards to those which were successfully revealed & are still in search locations
        let valid = revealed.filter(
            (card) => card.location === 'draw deck' || this.inAdditionalLocation(card)
        );
        // Converting valid to be same format as to what onSelect expects (Array or single object)
        valid = this.properties.numToSelect ? valid : valid.length > 0 ? valid[0] : null;

        this.properties.onSelect(player, searched, valid);
    }

    revealDrawDeckCards(card, player) {
        if (player !== this.choosingPlayer) {
            return false;
        }

        if (this.properties.numCards) {
            let cards = this.choosingPlayer.searchDrawDeck(this.properties.numCards);
            return cards.includes(card);
        }

        return card.location === 'draw deck' && card.controller === this.choosingPlayer;
    }

    searchCards(context) {
        if (this.properties.numCards) {
            return this.choosingPlayer.searchDrawDeck(this.properties.numCards, (card) =>
                this.checkCardCondition(card, context)
            );
        }

        return this.choosingPlayer.searchDrawDeck((card) => this.checkCardCondition(card, context));
    }

    inAdditionalLocation(card) {
        return (
            this.properties.additionalLocations.includes(card.location) &&
            card.controller === this.choosingPlayer
        );
    }

    checkCardCondition(card, context) {
        return (
            this.properties.cardType.includes(card.getType()) &&
            this.properties.cardCondition(card, context)
        );
    }
}

export default DeckSearchPrompt;
