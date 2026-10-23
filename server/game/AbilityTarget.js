import AbilityTargetMessages from './AbilityTargetMessages.js';
import AbilityChoiceSelection from './AbilityChoiceSelection.js';
import CardMatcher from './CardMatcher.js';
import CardSelector from './CardSelector.js';
import Messages from './Messages/index.js';
import { flatMap } from '../Array.js';

class AbilityTarget {
    static create(name, properties) {
        let { message, messages, ...rest } = properties;
        let defaultMessages = ['each', 'eachOpponent'].includes(properties.choosingPlayer)
            ? Messages.eachPlayerTargeting
            : null;

        let abilityMessages = new AbilityTargetMessages({
            message,
            messages: messages || defaultMessages
        });

        return new AbilityTarget(name, Object.assign(rest, { messages: abilityMessages }));
    }

    constructor(name, properties) {
        this.type = properties.type || 'choose';
        this.choosingPlayer = properties.choosingPlayer || 'current';
        this.name = name;
        this.properties = properties;
        this.messages = properties.messages;
        this.ifAble = !!properties.ifAble;
        this.subTargets = properties.subTargets
            ? Object.entries(properties.subTargets).map(([name, properties]) => {
                  properties.choosingPlayer = (player, context) =>
                      player === context.choosingPlayer;
                  return AbilityTarget.create(name, properties);
              })
            : [];
    }

    legalCards(context) {
        const players = this.getChoosingPlayers(context);
        if (players.some((player) => !player)) {
            return null;
        }

        const selector = CardSelector.for({ context, ...this.properties });
        const choosingPlayer = context.choosingPlayer;
        const byPlayer = new Map();
        for (const player of players) {
            context.choosingPlayer = player;
            byPlayer.set(player, selector.getEligibleTargets(context));
        }
        context.choosingPlayer = choosingPlayer;
        return byPlayer;
    }

    canResolve(context) {
        const selector = CardSelector.for({ context, ...this.properties });
        const players = this.getChoosingPlayers(context);
        return (
            this.ifAble ||
            (players.length > 0 &&
                players.every((choosingPlayer) => {
                    context.choosingPlayer = choosingPlayer;
                    return selector.hasEnoughTargets(context);
                }) &&
                this.subTargets.every((subTarget) => subTarget.canResolve(context)))
        );
    }

    buildPlayerSelection(context) {
        // Creating the selector once the target is being selected for effects such as keywords with a changing target amount
        const selector = this.createSelector(context);
        let eligibleCards = selector.getEligibleTargets(context);
        let requiresValidation = selector.requiresTargetValidation(context);
        let subResults = this.subTargets.map((subTarget) =>
            subTarget.buildPlayerSelection(context)
        );
        const selection = new AbilityChoiceSelection({
            choosingPlayer: context.choosingPlayer,
            eligibleChoices: eligibleCards,
            requiresValidation: requiresValidation,
            targetingType: this.type,
            subResults: subResults,

            name: this.name
        });
        selection.selector = selector;
        return selection;
    }

    resolve(context) {
        let results = this.getChoosingPlayers(context).map((choosingPlayer) => {
            context.choosingPlayer = choosingPlayer;
            return this.buildPlayerSelection(context);
        });

        for (let result of results) {
            context.game.queueSimpleStep(() => {
                if (result.subResults.length > 0) {
                    this.resolveSubActions(result, context);
                } else {
                    this.resolveAction(result, context);
                }
            });
        }

        return results;
    }

    resolveSubActions(result, context) {
        for (let subTarget of this.subTargets) {
            let subResult = result.subResults.find(
                (subResult) => subResult.name === subTarget.name
            );
            context.game.queueSimpleStep(() => {
                subTarget.resolveAction(subResult, context);
            });
        }
        context.game.queueSimpleStep(() => {
            context.currentTargetSelection = result;
            if (result.subResults.some((subResult) => subResult.cancelled)) {
                result.cancel();
            } else {
                let subValues = flatMap(
                    result.subResults.filter((subResult) => subResult.numValues > 0),
                    (subResult) => subResult.value
                );
                result.resolve(subValues);
                if (result.numValues === 0) {
                    this.messages.outputNoneSelected(context.game, context);
                } else {
                    this.messages.outputSelected(context.game, context);
                }
            }
        });
    }

    createSelector(context) {
        const byPlayer = context.legalTargetsAtInitiation?.get(this);
        if (!byPlayer) {
            return CardSelector.for({ context, ...this.properties });
        }

        const legal = new Set(byPlayer.get(context.choosingPlayer) || []);
        const matches = CardMatcher.createMatcher(this.properties.cardCondition || (() => true));
        return CardSelector.for({
            context,
            ...this.properties,
            cardCondition: (card, cardContext) => legal.has(card) && matches(card, cardContext)
        });
    }

    hasSingleChooser() {
        return (
            typeof this.choosingPlayer !== 'function' &&
            !['each', 'eachOpponent'].includes(this.choosingPlayer)
        );
    }

    isAnyNumber() {
        return this.properties.mode === 'unlimited' || this.properties.numCards === 0;
    }

    getChoosingPlayers(context) {
        if (typeof this.choosingPlayer === 'function') {
            return context.game
                .getPlayersInFirstPlayerOrder()
                .filter((player) => this.choosingPlayer(player, context));
        }

        if (this.choosingPlayer === 'opponent') {
            return [context.opponent];
        }

        if (this.choosingPlayer === 'each') {
            return context.game.getPlayersInFirstPlayerOrder();
        }

        if (this.choosingPlayer === 'eachOpponent') {
            return context.game.getOpponentsInFirstPlayerOrder(context.player);
        }

        return [context.player];
    }

    resolveAction(result, context) {
        context.choosingPlayer = result.choosingPlayer;
        context.currentTargetSelection = result;
        const selector = result.selector || this.createSelector(context);

        let unableToSelect =
            !selector.hasEnoughTargets(context) || (selector.optional && result.hasNoChoices());
        const snapshotted = context.legalTargetsAtInitiation?.has(this);
        if (
            snapshotted &&
            !this.ifAble &&
            !selector.optional &&
            !selector.hasEnoughTargets(context)
        ) {
            result.unsuccessful = true;
            result.resolve([]);
            return;
        }
        if (this.ifAble && unableToSelect) {
            this.messages.outputUnable(context.game, context);
            result.reject();
            return;
        }

        let otherProperties = Object.assign({}, this.properties);
        delete otherProperties.cardCondition;
        delete otherProperties.choosingPlayer;
        delete otherProperties.messages;
        let promptProperties = {
            context: context,
            source: context.source,
            selector,
            onSelect: (player, card) => {
                result.resolve(card);
                // A later target's condition can depend on this choice, such as "another character".
                if (context.targets && this.hasSingleChooser()) {
                    context.targets[this.name] = card;
                }
                if (!card || card.length === 0) {
                    this.messages.outputNoneSelected(context.game, context);
                } else {
                    this.messages.outputSelected(context.game, context);
                }
                return true;
            },
            onCancel: () => {
                if (this.isAnyNumber()) {
                    result.unsuccessful = true;
                    result.resolve([]);
                    return true;
                }
                if (selector.rejectAllowed(context)) {
                    result.reject();
                } else {
                    result.cancel();
                }
                this.messages.outputSkipped(context.game, context);
                return true;
            }
        };
        context.game.promptForSelect(
            result.choosingPlayer,
            Object.assign(promptProperties, otherProperties)
        );
    }
}

export default AbilityTarget;
