const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register(['onCardEntersPlay', 'onCardLeftPlay', 'onCardBlankToggled', 'onChallengeFinished', 'onPhaseEnded', 'onAtEndOfPhase', 'onRoundEnded']);
        this.effects = [];
    }

    add(effect) {
        this.effects.push(effect);
        effect.addTargets(this.getTargets());
    }

    getTargets() {
        var validTargets = this.game.allCards.filter(card => card.location === 'play area' || card.location === 'active plot');
        return validTargets.concat(_.values(this.game.getPlayers()));
    }

    reapplyStateDependentEffects() {
        _.each(this.effects, effect => {
            if(effect.isStateDependent) {
                effect.resetTargets(this.getTargets());
            }
        });
    }

    onCardEntersPlay(e, card) {
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent') {
                effect.addTargets([card]);
            }
        });
    }

    onCardLeftPlay(e, player, card) {
        _.each(this.effects, effect => {
            effect.removeTarget(card);
        });

        this.unapplyAndRemove(effect => effect.duration === 'persistent' && effect.source === card);
    }

    onCardBlankToggled(event, card, isBlank) {
        var matchingEffects = _.filter(this.effects, effect => effect.duration === 'persistent' && effect.source === card);
        _.each(matchingEffects, effect => {
            effect.setActive(!isBlank);
        });
    }

    onChallengeFinished() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfChallenge');
    }

    onPhaseEnded() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfPhase');
    }

    onAtEndOfPhase() {
        this.unapplyAndRemove(effect => effect.duration === 'atEndOfPhase');
    }

    onRoundEnded() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfRound');
    }

    unapplyAndRemove(match) {
        var [matchingEffects, remainingEffects] = _.partition(this.effects, match);
        _.each(matchingEffects, effect => {
            effect.cancel();
        });
        this.effects = remainingEffects;
    }
}

module.exports = EffectEngine;
