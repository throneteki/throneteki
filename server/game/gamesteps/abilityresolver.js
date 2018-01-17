const _ = require('underscore');

const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');

class AbilityResolver extends BaseStep {
    constructor(game, ability, context) {
        super(game);

        this.ability = ability;
        this.context = context;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.createSnapshot()),
            new SimpleStep(game, () => this.markActionAsTaken()),
            new SimpleStep(game, () => this.game.pushAbilityContext('card', context.source, 'cost')),
            new SimpleStep(game, () => this.resolveCosts()),
            new SimpleStep(game, () => this.waitForCostResolution()),
            new SimpleStep(game, () => this.payCosts()),
            new SimpleStep(game, () => this.game.popAbilityContext()),
            new SimpleStep(game, () => this.game.pushAbilityContext('card', context.source, 'effect')),
            new SimpleStep(game, () => this.chooseOpponents()),
            new SimpleStep(game, () => this.resolveTargets()),
            new SimpleStep(game, () => this.waitForTargetResolution()),
            new SimpleStep(game, () => this.incrementAbilityLimit()),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.raiseCardPlayedIfEvent()),
            new SimpleStep(game, () => this.game.popAbilityContext())
        ]);
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.cancelled = true;
        this.pipeline.cancelStep();
    }

    continue() {
        try {
            return this.pipeline.continue();
        } catch(e) {
            this.game.reportError(e);

            let currentAbilityContext = this.game.currentAbilityContext;
            if(currentAbilityContext && currentAbilityContext.source === 'card' && currentAbilityContext.card === this.context.source) {
                this.game.popAbilityContext();
            }

            return true;
        }
    }

    createSnapshot() {
        if(this.context.source.getType() === 'character' || this.context.source.getType() === 'location' || this.context.source.getType() === 'attachment') {
            this.context.cardStateWhenInitiated = this.context.source.createSnapshot();
        }
    }

    markActionAsTaken() {
        if(this.ability.isAction()) {
            this.game.markActionAsTaken(this.context);
        }
    }

    resolveCosts() {
        this.canPayResults = this.ability.resolveCosts(this.context);
    }

    waitForCostResolution() {
        this.cancelled = _.any(this.canPayResults, result => result.resolved && !result.value);

        if(!_.all(this.canPayResults, result => result.resolved)) {
            return false;
        }
    }

    payCosts() {
        if(this.cancelled) {
            return;
        }

        this.ability.payCosts(this.context);
    }

    chooseOpponents() {
        if(this.cancelled || !this.ability.needsChooseOpponent()) {
            return;
        }

        this.game.promptForOpponentChoice(this.context.player, {
            condition: opponent => this.ability.canChooseOpponent(opponent),
            onSelect: opponent => {
                this.context.opponent = opponent;
            },
            onCancel: () => {
                this.cancelled = true;
            },
            source: this.context.source
        });
    }

    resolveTargets() {
        if(this.cancelled) {
            return;
        }

        this.targetResults = this.ability.resolveTargets(this.context);
    }

    waitForTargetResolution() {
        if(this.cancelled) {
            return;
        }

        this.cancelled = _.any(this.targetResults, result => result.resolved && !result.value);

        if(!_.all(this.targetResults, result => result.resolved)) {
            return false;
        }

        this.context.targets.setSelections(this.targetResults);

        if(this.context.targets.hasTargets()) {
            this.game.raiseEvent('onTargetsChosen', { ability: this.ability, targets: this.context.targets }, () => {
                this.context.targets.updateTargets();
                this.context.target = this.context.targets.defaultTarget;
            });
        }
    }

    incrementAbilityLimit() {
        if(this.cancelled) {
            return;
        }

        this.ability.incrementLimit();
    }

    executeHandler() {
        if(this.cancelled) {
            return;
        }

        // Check to make sure the ability is actually a card ability. For
        // instance, marshaling does not count as initiating a card ability and
        // thus is not subject to cancels such as Treachery.
        if(this.ability.isCardAbility()) {
            let targets = this.context.targets.getTargets();
            this.game.raiseEvent('onCardAbilityInitiated', { player: this.context.player, source: this.context.source, targets: targets, cannotBeCanceled: !!this.ability.cannotBeCanceled, isForced: !!this.ability.isForcedAbility() }, () => {
                this.ability.executeHandler(this.context);
            });
        } else {
            this.ability.executeHandler(this.context);
        }
    }

    raiseCardPlayedIfEvent() {
        // An event card is considered to be played even if it has been
        // cancelled. Raising the event here will allow forced reactions and
        // reactions to fire with the appropriate timing. There are no cards
        // with an interrupt to a card being played. If any are ever released,
        // then this event will need to wrap the execution of the entire
        // ability instead.
        if(this.ability.isPlayableEventAbility()) {
            if(this.context.source.location === 'being played') {
                this.context.source.owner.moveCard(this.context.source, this.context.source.eventPlacementLocation);
            }
            this.game.raiseEvent('onCardPlayed', { player: this.context.player, card: this.context.source });
        }
    }
}

module.exports = AbilityResolver;
