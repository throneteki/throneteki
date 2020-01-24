const AbilityTargetMessages = require('./AbilityTargetMessages');
const AbilityChoiceSelection = require('./AbilityChoiceSelection');
const CardSelector = require('./CardSelector.js');
const Messages = require('./Messages');

class AbilityTarget {
    static create(name, properties) {
        let {message, messages, ...rest} = properties;
        let defaultMessages = ['each', 'eachOpponent'].includes(properties.choosingPlayer) ? Messages.eachPlayerTargeting : null;

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
        this.selector = CardSelector.for(properties);
        this.messages = properties.messages;
        this.ifAble = !!properties.ifAble;
    }

    canResolve(context) {
        const players = this.getChoosingPlayers(context);
        return this.ifAble || players.length > 0 && players.every(choosingPlayer => {
            context.choosingPlayer = choosingPlayer;
            return this.selector.hasEnoughTargets(context);
        });
    }

    resolve(context) {
        let results = this.getChoosingPlayers(context).map(choosingPlayer => {
            context.choosingPlayer = choosingPlayer;
            let eligibleCards = this.selector.getEligibleTargets(context);
            return new AbilityChoiceSelection({
                choosingPlayer: choosingPlayer,
                eligibleChoices: eligibleCards,
                targetingType: this.type,
                name: this.name
            });
        });

        for(let result of results) {
            context.game.queueSimpleStep(() => {
                this.resolveAction(result, context);
            });
        }

        return results;
    }

    getChoosingPlayers(context) {
        if(typeof this.choosingPlayer === 'function') {
            return context.game.getPlayersInFirstPlayerOrder().filter(player => this.choosingPlayer(player));
        }

        if(this.choosingPlayer === 'each') {
            return context.game.getPlayersInFirstPlayerOrder();
        }

        if(this.choosingPlayer === 'eachOpponent') {
            return context.game.getOpponentsInFirstPlayerOrder(context.player);
        }

        return [context.player];
    }

    resolveAction(result, context) {
        context.choosingPlayer = result.choosingPlayer;
        context.currentTargetSelection = result;

        let unableToSelect = !this.selector.hasEnoughTargets(context) || this.selector.optional && result.hasNoChoices();
        if(this.ifAble && unableToSelect) {
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
                if(!card || card.length === 0) {
                    this.messages.outputNoneSelected(context.game, context);
                } else {
                    this.messages.outputSelected(context.game, context);
                }
                return true;
            },
            onCancel: () => {
                if(this.ifAble) {
                    result.reject();
                } else {
                    result.cancel();
                }
                this.messages.outputSkipped(context.game, context);
                return true;
            }
        };
        context.game.promptForSelect(result.choosingPlayer, Object.assign(promptProperties, otherProperties));
    }
}

module.exports = AbilityTarget;
