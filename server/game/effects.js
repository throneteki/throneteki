const _ = require('underscore');

const AbilityLimit = require('./abilitylimit.js');
const CostReducer = require('./costreducer.js');
const PlayableLocation = require('./playablelocation.js');
const CannotRestriction = require('./cannotrestriction.js');
const ImmunityRestriction = require('./immunityrestriction.js');

function cannotEffect(type) {
    return function(predicate) {
        let restriction = new CannotRestriction(type, predicate);
        return {
            apply: function(card) {
                card.addAbilityRestriction(restriction);
            },
            unapply: function(card) {
                card.removeAbilityRestriction(restriction);
            }
        };
    };
}

const Effects = {
    all: function(effects) {
        let stateDependentEffects = _.filter(effects, effect => effect.isStateDependent);
        return {
            apply: function(card, context) {
                _.each(effects, effect => effect.apply(card, context));
            },
            reapply: function(card, context) {
                _.each(stateDependentEffects, effect => {
                    if(effect.reapply) {
                        effect.reapply(card, context);
                    } else {
                        effect.unapply(card, context);
                        effect.apply(card, context);
                    }
                });
            },
            unapply: function(card, context) {
                _.each(effects, effect => effect.unapply(card, context));
            },
            isStateDependent: (stateDependentEffects.length !== 0)
        };
    },
    cannotBeDeclaredAsAttacker: cannotEffect('declareAsAttacker'),
    cannotBeDeclaredAsDefender: cannotEffect('declareAsDefender'),
    cannotParticipate: cannotEffect('participateInChallenge'),
    doesNotKneelAsAttacker: function() {
        return {
            apply: function(card) {
                card.challengeOptions.doesNotKneelAs.attacker = true;
            },
            unapply: function(card) {
                card.challengeOptions.doesNotKneelAs.attacker = false;
            }
        };
    },
    doesNotKneelAsDefender: function() {
        return {
            apply: function(card) {
                card.challengeOptions.doesNotKneelAs.defender = true;
            },
            unapply: function(card) {
                card.challengeOptions.doesNotKneelAs.defender = false;
            }
        };
    },
    canBeDeclaredWithoutIcon: function() {
        return {
            apply: function(card) {
                card.challengeOptions.canBeDeclaredWithoutIcon = true;
            },
            unapply: function(card) {
                card.challengeOptions.canBeDeclaredWithoutIcon = false;
            }
        };
    },
    canBeDeclaredWhileKneeling: function() {
        return {
            apply: function(card) {
                card.challengeOptions.canBeDeclaredWhileKneeling = true;
            },
            unapply: function(card) {
                card.challengeOptions.canBeDeclaredWhileKneeling = false;
            }
        };
    },
    modifyStrength: function(value) {
        return {
            apply: function(card) {
                card.modifyStrength(value, true);
            },
            unapply: function(card) {
                card.modifyStrength(-value, false);
            }
        };
    },
    modifyStrengthMultiplier: function(value) {
        return {
            apply: function(card) {
                card.modifyStrengthMultiplier(value, true);
            },
            unapply: function(card) {
                card.modifyStrengthMultiplier(1.0 / value, false);
            }
        };
    },
    modifyDominanceStrength: function(value) {
        return {
            apply: function(card) {
                card.modifyDominanceStrength(value);
            },
            unapply: function(card) {
                card.modifyDominanceStrength(-value);
            }
        };
    },
    modifyGold: function(value) {
        return {
            apply: function(card) {
                card.goldModifier += value;
            },
            unapply: function(card) {
                card.goldModifier -= value;
            }
        };
    },
    modifyInitiative: function(value) {
        return {
            apply: function(card) {
                card.initiativeModifier += value;
            },
            unapply: function(card) {
                card.initiativeModifier -= value;
            }
        };
    },
    modifyReserve: function(value) {
        return {
            apply: function(card) {
                card.reserveModifier += value;
            },
            unapply: function(card) {
                card.reserveModifier -= value;
            }
        };
    },
    modifyClaim: function(value) {
        return {
            apply: function(card) {
                card.claimModifier += value;
            },
            unapply: function(card) {
                card.claimModifier -= value;
            }
        };
    },
    preventPlotModifier: function(modifier) {
        return {
            apply: function(card) {
                card.canProvidePlotModifier[modifier] = false;
            },
            unapply: function(card) {
                card.canProvidePlotModifier[modifier] = true;
            }
        };
    },
    dynamicStrength: function(calculate) {
        return {
            apply: function(card, context) {
                context.dynamicStrength = context.dynamicStrength || {};
                context.dynamicStrength[card.uuid] = calculate(card, context) || 0;
                card.modifyStrength(context.dynamicStrength[card.uuid], true);
            },
            reapply: function(card, context) {
                let currentStrength = context.dynamicStrength[card.uuid];
                let newStrength = calculate(card, context) || 0;
                context.dynamicStrength[card.uuid] = newStrength;
                card.modifyStrength(newStrength - currentStrength, true);
            },
            unapply: function(card, context) {
                card.modifyStrength(-context.dynamicStrength[card.uuid], false);
                delete context.dynamicStrength[card.uuid];
            },
            isStateDependent: true
        };
    },
    doesNotContributeStrength: function() {
        return {
            apply: function(card) {
                card.challengeOptions.doesNotContributeStrength = true;
            },
            unapply: function(card) {
                card.challengeOptions.doesNotContributeStrength = false;
            }
        };
    },
    addStealthLimit: function(value) {
        return {
            apply: function(card) {
                card.stealthLimit += value;
            },
            unapply: function(card) {
                card.stealthLimit -= value;
            }
        };
    },
    addIcon: function(icon) {
        return {
            apply: function(card) {
                card.addIcon(icon);
            },
            unapply: function(card) {
                card.removeIcon(icon);
            }
        };
    },
    removeIcon: function(icon) {
        return {
            apply: function(card) {
                card.removeIcon(icon);
            },
            unapply: function(card) {
                card.addIcon(icon);
            }
        };
    },
    addKeyword: function(keyword) {
        return {
            apply: function(card) {
                card.addKeyword(keyword);
            },
            unapply: function(card) {
                card.removeKeyword(keyword);
            }
        };
    },
    removeKeyword: function(keyword) {
        return {
            apply: function(card) {
                card.removeKeyword(keyword);
            },
            unapply: function(card) {
                card.addKeyword(keyword);
            }
        };
    },
    addMultipleKeywords: function(keywords) {
        return {
            apply: function(card) {
                _.each(keywords, keyword => card.addKeyword(keyword));
            },
            unapply: function(card) {
                _.each(keywords, keyword => card.removeKeyword(keyword));
            }
        };
    },
    removeAllKeywords: function() {
        return [
            this.removeKeyword('Ambush'),
            this.removeKeyword('Insight'),
            this.removeKeyword('Intimidate'),
            this.removeKeyword('Pillage'),
            this.removeKeyword('Renown'),
            this.removeKeyword('Stealth'),
            this.removeKeyword('Terminal'),
            this.removeKeyword('Limited')
        ];
    },
    addTrait: function(trait) {
        return {
            apply: function(card) {
                card.addTrait(trait);
            },
            unapply: function(card) {
                card.removeTrait(trait);
            }
        };
    },
    addFaction: function(faction) {
        return {
            apply: function(card) {
                card.addFaction(faction);
            },
            unapply: function(card) {
                card.removeFaction(faction);
            }
        };
    },
    killByStrength: {
        apply: function(card, context) {
            context.killByStrength = context.killByStrength || {};
            if(card.getStrength() <= 0 && !context.killByStrength[card.uuid]) {
                context.killByStrength[card.uuid] = true;
                card.controller.killCharacter(card, false);
                context.game.addMessage('{0} is killed as its STR is 0', card);
            }
        },
        unapply: function() {
            // nothing happens when this effect expires.
        },
        isStateDependent: true
    },
    blank: {
        apply: function(card) {
            card.setBlank();
        },
        unapply: function(card) {
            card.clearBlank();
        }
    },
    poison: {
        apply: function(card, context) {
            card.addToken('poison', 1);
            context.game.addMessage('{0} uses {1} to place 1 poison token on {2}', context.source.controller, context.source, card);
        },
        unapply: function(card, context) {
            if(card.location === 'play area' && card.hasToken('poison')) {
                card.removeToken('poison', 1);
                card.controller.killCharacter(card);
                context.game.addMessage('{0} uses {1} to kill {2} at the end of the phase', context.source.controller, context.source, card);
            }
        }
    },
    gainAmbush: function(costModifier = 0) {
        return {
            apply: function(card, context) {
                context.gainAmbush = context.gainAmbush || {};
                context.gainAmbush[card.uuid] = card.ambushCost;
                card.ambushCost = card.cardData.cost + costModifier;
            },
            unapply: function(card, context) {
                card.ambushCost = context.gainAmbush[card.uuid];
                delete context.gainAmbush[card.uuid];
            }
        };
    },
    discardIfStillInPlay: function(allowSave = false) {
        return {
            apply: function(card, context) {
                context.discardIfStillInPlay = context.discardIfStillInPlay || [];
                context.discardIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.discardIfStillInPlay.includes(card)) {
                    context.discardIfStillInPlay = _.reject(context.discardIfStillInPlay, c => c === card);
                    card.controller.discardCard(card, allowSave);
                    context.game.addMessage('{0} discards {1} at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    killIfStillInPlay: function(allowSave = false) {
        return {
            apply: function(card, context) {
                context.killIfStillInPlay = context.killIfStillInPlay || [];
                context.killIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.killIfStillInPlay.includes(card)) {
                    context.killIfStillInPlay = _.reject(context.killIfStillInPlay, c => c === card);
                    card.controller.killCharacter(card, allowSave);
                    context.game.addMessage('{0} kills {1} at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    moveToDeadPileIfStillInPlay: function() {
        return {
            apply: function(card, context) {
                context.moveToDeadPileIfStillInPlay = context.moveToDeadPileIfStillInPlay || [];
                context.moveToDeadPileIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.moveToDeadPileIfStillInPlay.includes(card)) {
                    context.moveToDeadPileIfStillInPlay = _.reject(context.moveToDeadPileIfStillInPlay, c => c === card);
                    card.owner.moveCard(card, 'dead pile');
                    context.game.addMessage('{0} moves {1} to its owner\'s dead pile at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    returnToHandIfStillInPlay: function(allowSave = false) {
        return {
            apply: function(card, context) {
                context.returnToHandIfStillInPlay = context.returnToHandIfStillInPlay || [];
                context.returnToHandIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.returnToHandIfStillInPlay.includes(card)) {
                    context.returnToHandIfStillInPlay = _.reject(context.returnToHandIfStillInPlay, c => c === card);
                    card.controller.returnCardToHand(card, allowSave);
                    context.game.addMessage('{0} returns {1} to hand at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    shuffleIntoDeckIfStillInPlay: function() {
        return {
            apply: function(card, context) {
                context.shuffleIntoDeckIfStillInPlay = context.shuffleIntoDeckIfStillInPlay || [];
                context.shuffleIntoDeckIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.shuffleIntoDeckIfStillInPlay.includes(card)) {
                    context.shuffleIntoDeckIfStillInPlay = _.reject(context.shuffleIntoDeckIfStillInPlay, c => c === card);
                    card.owner.moveCard(card, 'draw deck');
                    card.owner.shuffleDrawDeck();
                    context.game.addMessage('{0} shuffles {1} into their deck at the end of the phase because of {2}', card.owner, card, context.source);
                }
            }
        };
    },
    doesNotContributeToDominance: function() {
        return {
            apply: function(card) {
                card.contributesToDominance = false;
            },
            unapply: function(card) {
                card.contributesToDominance = true;
            }
        };
    },
    doesNotStandDuringStanding: function() {
        return {
            apply: function(card) {
                card.standsDuringStanding = false;
            },
            unapply: function(card) {
                card.standsDuringStanding = true;
            }
        };
    },
    optionalStandDuringStanding: function() {
        return {
            apply: function(card) {
                card.optionalStandDuringStanding = true;
            },
            unapply: function(card) {
                card.optionalStandDuringStanding = false;
            }
        };
    },
    immuneTo: function(cardCondition) {
        let restriction = new ImmunityRestriction(cardCondition);
        return {
            apply: function(card) {
                card.addAbilityRestriction(restriction);
            },
            unapply: function(card) {
                card.removeAbilityRestriction(restriction);
            }
        };
    },
    takeControl: function(newController) {
        return {
            apply: function(card, context) {
                context.takeControl = context.takeControl || {};
                context.takeControl[card.uuid] = { originalController: card.controller };
                context.game.takeControl(newController, card);
                context.game.addMessage('{0} uses {1} to take control of {2}', context.source.controller, context.source, card);
            },
            unapply: function(card, context) {
                context.game.takeControl(context.takeControl[card.uuid].originalController, card);
                delete context.takeControl[card.uuid];
            }
        };
    },
    cannotMarshal: cannotEffect('marshal'),
    cannotPlay: cannotEffect('play'),
    cannotBeBypassedByStealth: cannotEffect('bypassByStealth'),
    cannotBeKneeled: cannotEffect('kneel'),
    cannotBeKilled: cannotEffect('kill'),
    cannotGainChallengeBonus: function() {
        return {
            apply: function(player) {
                player.cannotGainChallengeBonus = true;
            },
            unapply: function(player) {
                player.cannotGainChallengeBonus = false;
            }
        };
    },
    cannotTriggerCardAbilities: function() {
        return {
            apply: function(player) {
                player.cannotTriggerCardAbilities = true;
            },
            unapply: function(player) {
                player.cannotTriggerCardAbilities = false;
            }
        };
    },
    modifyMaxLimited: function(amount) {
        return {
            apply: function(player) {
                player.maxLimited += amount;
            },
            unapply: function(player) {
                player.maxLimited -= amount;
            }
        };
    },
    modifyChallengeTypeLimit: function(challengeType, value) {
        return {
            apply: function(player) {
                player.addChallenge(challengeType, value);
            },
            unapply: function(player) {
                player.addChallenge(challengeType, -value);
            }
        };
    },
    cannotInitiateChallengeType(challengeType) {
        return {
            apply: function(player) {
                player.setCannotInitiateChallengeForType(challengeType, true);
            },
            unapply: function(player) {
                player.setCannotInitiateChallengeForType(challengeType, false);
            }
        };
    },
    setMaxChallenge: function(max) {
        return {
            apply: function(player) {
                player.setMaxChallenge(max);
            },
            unapply: function(player) {
                player.clearMaxChallenge();
            }
        };
    },
    setMinReserve: function(min) {
        return {
            apply: function(player, context) {
                context.setMinReserve = context.setMinReserve || {};
                context.setMinReserve[player.id] = player.minReserve;
                player.minReserve = min;
            },
            unapply: function(player, context) {
                player.minReserve = context.setMinReserve[player.id];
                delete context.setMinReserve[player.id];
            }
        };
    },
    contributeChallengeStrength: function(value) {
        return {
            apply: function(player, context) {
                let challenge = context.game.currentChallenge;
                if(!challenge) {
                    return;
                }

                if(challenge.attackingPlayer === player) {
                    challenge.modifyAttackerStrength(value);
                    context.game.addMessage('{0} uses {1} to add {2} to the strength of this challenge for a total of {3}', player, context.source, value, challenge.attackerStrength);
                } else if(challenge.defendingPlayer === player) {
                    challenge.modifyDefenderStrength(value);
                    context.game.addMessage('{0} uses {1} to add {2} to the strength of this challenge for a total of {3}', player, context.source, value, challenge.defenderStrength);
                }
            },
            unapply: function(player, context) {
                let challenge = context.game.currentChallenge;
                if(!challenge) {
                    return;
                }

                if(challenge.attackingPlayer === player) {
                    challenge.modifyAttackerStrength(-value);
                } else if(challenge.defendingPlayer === player) {
                    challenge.modifyDefenderStrength(-value);
                }
            }
        };
    },
    setChallengerLimit: function(value) {
        return {
            apply: function(player, context) {
                context.setChallengerLimit = context.setChallengerLimit || {};
                context.setChallengerLimit[player.id] = player.challengerLimit;
                player.challengerLimit = value;
            },
            unapply: function(player, context) {
                player.challengerLimit = context.setChallengerLimit[player.id];
                delete context.setChallengerLimit[player.id];
            }
        };
    },
    cannotWinChallenge: function() {
        return {
            apply: function(player) {
                player.cannotWinChallenge = true;
            },
            unapply: function(player) {
                player.cannotWinChallenge = false;
            }
        };
    },
    canMarshalFrom: function(p, location) {
        var playableLocation = new PlayableLocation('marshal', p, location);
        return {
            apply: function(player) {
                player.playableLocations.push(playableLocation);
            },
            unapply: function(player) {
                player.playableLocations = _.reject(player.playableLocations, l => l === playableLocation);
            }
        };
    },
    canPlayFromOwn: function(location) {
        return {
            apply: function(player, context) {
                let playableLocation = new PlayableLocation('play', player, location);
                context.canPlayFromOwn = playableLocation;
                player.playableLocations.push(playableLocation);
            },
            unapply: function(player, context) {
                player.playableLocations = _.reject(player.playableLocations, l => l === context.canPlayFromOwn);
                delete context.canPlayFromOwn;
            }
        };
    },
    canSelectAsFirstPlayer: function(condition) {
        return {
            apply: function(player) {
                player.firstPlayerSelectCondition = condition;
            },
            unapply: function(player) {
                player.firstPlayerSelectCondition = null;
            }
        };
    },
    cannotStandMoreThan: function(max, match) {
        let restriction = { max: max, match: match };
        return {
            apply: function(player) {
                player.standPhaseRestrictions.push(restriction);
            },
            unapply: function(player) {
                player.standPhaseRestrictions = _.reject(player.standPhaseRestrictions, r => r === restriction);
            }
        };
    },
    reduceCost: function(properties) {
        return {
            apply: function(player, context) {
                context.reducers = context.reducers || [];
                var reducer = new CostReducer(context.game, context.source, properties);
                context.reducers.push(reducer);
                player.addCostReducer(reducer);
            },
            unapply: function(player, context) {
                if(context.reducers.length > 0) {
                    _.each(context.reducers, reducer => player.removeCostReducer(reducer));
                }
            }
        };
    },
    reduceNextCardCost: function(playingTypes, amount, match) {
        return this.reduceCost({
            playingTypes: playingTypes,
            amount: amount,
            match: match,
            limit: AbilityLimit.fixed(1)
        });
    },
    reduceNextMarshalledCardCost: function(amount, match) {
        return this.reduceNextCardCost('marshal', amount, match);
    },
    reduceNextPlayedCardCost: function(amount, match) {
        return this.reduceNextCardCost('play', amount, match);
    },
    reduceNextMarshalledOrPlayedCardCost: function(amount, match) {
        return this.reduceNextCardCost(['marshal', 'play'], amount, match);
    },
    reduceFirstCardCostEachRound: function(playingTypes, amount, match) {
        return this.reduceCost({
            playingTypes: playingTypes,
            amount: amount,
            match: match,
            limit: AbilityLimit.perRound(1)
        });
    },
    reduceFirstPlayedCardCostEachRound: function(amount, match) {
        return this.reduceFirstCardCostEachRound('play', amount, match);
    },
    reduceFirstMarshalledCardCostEachRound: function(amount, match) {
        return this.reduceFirstCardCostEachRound('marshal', amount, match);
    },
    reduceFirstMarshalledOrPlayedCardCostEachRound: function(amount, match) {
        return this.reduceFirstCardCostEachRound(['marshal', 'play'], amount, match);
    },
    reduceAmbushCardCost: function(amount, match) {
        return this.reduceCost({
            playingTypes: 'ambush',
            amount: amount,
            match: match
        });
    },
    increaseCost: function(properties) {
        properties.amount = -properties.amount;
        return this.reduceCost(properties);
    },
    dynamicUsedPlots: function(calculate) {
        return {
            apply: function(player, context) {
                context.dynamicUsedPlots = context.dynamicUsedPlots || {};
                context.dynamicUsedPlots[player.name] = calculate(player, context) || 0;
                player.modifyUsedPlots(context.dynamicUsedPlots[player.name]);
            },
            reapply: function(player, context) {
                let oldValue = context.dynamicUsedPlots[player.name];
                let newValue = calculate(player, context) || 0;
                context.dynamicUsedPlots[player.name] = newValue;
                player.modifyUsedPlots(newValue - oldValue);
            },
            unapply: function(player, context) {
                player.modifyUsedPlots(-context.dynamicUsedPlots[player.name]);
                delete context.dynamicUsedPlots[player.name];
            },
            isStateDependent: true
        };
    },
    /**
     * Effects specifically for Old Wyk.
     */
    returnToHandOrDeckBottom: function() {
        return {
            apply: function(card, context) {
                context.returnToHandOrDeckBottom = context.returnToHandOrDeckBottom || [];
                context.returnToHandOrDeckBottom.push(card);
            },
            unapply: function(card, context) {
                if(!context.returnToHandOrDeckBottom.includes(card)) {
                    return;
                }

                context.returnToHandOrDeckBottom = _.reject(context.returnToHandOrDeckBottom, c => c === card);

                var challenge = context.game.currentChallenge;
                if(challenge && challenge.winner === context.source.controller && challenge.strengthDifference >= 5) {
                    card.controller.moveCard(card, 'hand');
                    context.game.addMessage('{0} returns {1} to their hand', context.source.controller, card);
                } else {
                    card.controller.moveCard(card, 'draw deck', { bottom: true });
                    context.game.addMessage('{0} returns {1} to the bottom of their deck', context.source.controller, card);
                }
            }
        };
    }
};

module.exports = Effects;
