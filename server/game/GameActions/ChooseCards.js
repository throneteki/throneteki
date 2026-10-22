import CardMatcher from '../CardMatcher.js';
import GameAction from './GameAction.js';
import SimultaneousActions from './SimultaneousActions.js';

const AllCardTypes = [
    'agenda',
    'attachment',
    'character',
    'event',
    'faction',
    'location',
    'plot',
    'title'
];

// The context can inherit its properties from a prototype (see AbilityChoosePlayerDefinition), which
// spreading it would drop.
function withChoosingPlayer(context, player) {
    return Object.assign(Object.create(context), { choosingPlayer: player });
}

class ChooseCards extends GameAction {
    constructor({
        player,
        players,
        cardCondition = {},
        mode = 'single',
        numCards = 1,
        title = 'Select a card',
        gameAction
    }) {
        super('chooseCards');

        this.playersFunc = players || ((context) => [(player || ((ctx) => ctx.player))(context)]);
        this.cardMatcher =
            typeof cardCondition === 'function'
                ? cardCondition
                : CardMatcher.createMatcher(cardCondition);
        this.mode = mode;
        this.numCardsFunc = typeof numCards === 'function' ? numCards : () => numCards;
        this.titleFunc = typeof title === 'function' ? title : () => title;
        this.gameActionFactory = gameAction;
    }

    logsOwnMessage() {
        return true;
    }

    canChangeGameState({ context }) {
        return (
            this.numCardsFunc(context) > 0 &&
            this.playersFunc(context).some(
                (player) => this.getChoosableCards(player, context).length > 0
            )
        );
    }

    getChoosableCards(player, context) {
        const choosingContext = withChoosingPlayer(context, player);
        return context.game.allCards.filter(
            (card) =>
                this.cardMatcher(card, choosingContext) &&
                this.gameActionFactory(card, choosingContext).allow(choosingContext)
        );
    }

    createEvent({ context }) {
        const listed = this.playersFunc(context);
        const players = context.game
            .getPlayersInFirstPlayerOrder()
            .filter((player) => listed.includes(player));

        return this.event('onCardsChosen', { players }, (event) => {
            const chosen = new Map();

            for (const player of players) {
                context.game.queueSimpleStep(() => this.promptPlayer(player, context, chosen));
            }

            context.game.queueSimpleStep(() => {
                context.chosenCards = [...chosen.values()].flat();
                for (const [player, cards] of chosen) {
                    this.attachResolution(event, player, cards, context);
                }
            });
        });
    }

    promptPlayer(player, context, chosen) {
        const choosable = this.getChoosableCards(player, context);
        const numCards = this.numCardsFunc(context);
        if (choosable.length === 0 || numCards === 0) {
            return;
        }

        context.game.promptForSelect(player, {
            activePromptTitle: this.titleFunc(withChoosingPlayer(context, player)),
            mode: this.mode,
            numCards: this.mode === 'exactly' ? Math.min(numCards, choosable.length) : numCards,
            multiSelect: true,
            cardType: AllCardTypes,
            cardCondition: (card) => choosable.includes(card),
            canCancel: context.game.manualMode.enabled,
            onSelect: (selectingPlayer, cards) => {
                chosen.set(player, Array.isArray(cards) ? cards : [cards]);
                return true;
            },
            source: context.source
        });
    }

    attachResolution(event, player, cards, context) {
        const choosingContext = withChoosingPlayer(context, player);
        const action = new SimultaneousActions(
            cards.map((card) => this.gameActionFactory(card, choosingContext))
        );
        const resolution = action.createEvent(choosingContext);

        resolution.thenExecute(() => {
            const result = action.resultMessage(choosingContext, resolution);
            if (result.length > 0) {
                context.game.addMessage('{0} {1}', player, result);
            }
        });
        event.thenAttachEvent(resolution);
    }
}

export default ChooseCards;
