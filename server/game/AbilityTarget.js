const AbilityTargetMessages = require('./AbilityTargetMessages');
const AbilityChoiceSelection = require('./AbilityChoiceSelection');
const CardSelector = require('./CardSelector.js');
const Messages = require('./Messages');
const { flatMap } = require('../Array');

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
        this.selector = CardSelector.for({ context, ...this.properties });
        let eligibleCards = this.selector.getEligibleTargets(context);
        let requiresValidation = this.selector.requiresTargetValidation(context);
        let subResults = this.subTargets.map((subTarget) =>
            subTarget.buildPlayerSelection(context)
        );
        return new AbilityChoiceSelection({
            choosingPlayer: context.choosingPlayer,
            eligibleChoices: eligibleCards,
            requiresValidation: requiresValidation,
            targetingType: this.type,
            subResults: subResults,

            name: this.name
        });
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

        let unableToSelect =
            !this.selector.hasEnoughTargets(context) ||
            (this.selector.optional && result.hasNoChoices());
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
            selector: this.selector,
            onSelect: (player, card) => {
                result.resolve(card);
                if (!card || card.length === 0) {
                    this.messages.outputNoneSelected(context.game, context);
                } else {
                    this.messages.outputSelected(context.game, context);
                }
                return true;
            },
            onCancel: () => {
                if (this.selector.rejectAllowed(context)) {
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

module.exports = AbilityTarget;
