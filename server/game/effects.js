const _ = require('underscore');

const AbilityLimit = require('./abilitylimit.js');
const AllowedChallenge = require('./AllowedChallenge');
const CostReducer = require('./costreducer.js');
const PlayableLocation = require('./playablelocation.js');
const CannotRestriction = require('./cannotrestriction.js');
const ChallengeRestriction = require('./ChallengeRestriction.js');
const ImmunityRestriction = require('./immunityrestriction.js');
const GoldSource = require('./GoldSource.js');

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

function losesAspectEffect(aspect) {
    return function() {
        return {
            apply: function(card) {
                card.loseAspect(aspect);
            },
            unapply: function(card) {
                card.restoreAspect(aspect);
            }
        };
    };
}

function challengeOptionEffect(key) {
    return function() {
        return {
            apply: function(card, context) {
                card.challengeOptions.add(key);
                if(context.game.currentChallenge) {
                    context.game.currentChallenge.calculateStrength();
                }
            },
            unapply: function(card, context) {
                card.challengeOptions.remove(key);
                if(context.game.currentChallenge) {
                    context.game.currentChallenge.calculateStrength();
                }
            }
        };
    };
}

function dominanceOptionEffect(key) {
    return function() {
        return {
            apply: function(card) {
                card.dominanceOptions.add(key);
            },
            unapply: function(card) {
                card.dominanceOptions.remove(key);
            }
        };
    };
}

const Effects = {
    setSetupGold: function(value) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.setupGold = value;
            },
            unapply: function(player) {
                player.setupGold = 8;
            }
        };
    },
    entersPlayKneeled: function() {
        return {
            apply: function(card) {
                card.entersPlayKneeled = true;
            },
            unapply: function(card) {
                card.entersPlayKneeled = false;
            }
        };
    },
    setCardType: function(type) {
        return {
            apply: function(card) {
                card.setCardType(type);
            },
            unapply: function(card) {
                card.setCardType(undefined);
            }
        };
    },
    cannotBeDeclaredAsAttacker: cannotEffect('declareAsAttacker'),
    cannotBeDeclaredAsDefender: cannotEffect('declareAsDefender'),
    cannotParticipate: cannotEffect('participateInChallenge'),
    doesNotKneelAsAttacker: challengeOptionEffect('doesNotKneelAsAttacker'),
    doesNotKneelAsDefender: challengeOptionEffect('doesNotKneelAsDefender'),
    consideredToBeAttacking: function() {
        return {
            apply: function(card, context) {
                let challenge = context.game.currentChallenge;
                if(card.canParticipateInChallenge() && !challenge.isAttacking(card)) {
                    challenge.addAttacker(card);
                }
            },
            unapply: function(card, context) {
                let challenge = context.game.currentChallenge;

                if(challenge && challenge.isAttacking(card)) {
                    challenge.removeFromChallenge(card);
                }
            }
        };
    },
    canBeDeclaredWithoutIcon: challengeOptionEffect('canBeDeclaredWithoutIcon'),
    canBeDeclaredWhileKneeling: challengeOptionEffect('canBeDeclaredWhileKneeling'),
    mustBeDeclaredAsAttacker: challengeOptionEffect('mustBeDeclaredAsAttacker'),
    mustBeDeclaredAsDefender: challengeOptionEffect('mustBeDeclaredAsDefender'),
    restrictAttachmentsTo: function(trait) {
        return Effects.addKeyword(`No attachments except <i>${trait}</i>`);
    },
    modifyStrength: function(value) {
        return {
            gameAction: value < 0 ? 'decreaseStrength' : 'increaseStrength',
            apply: function(card) {
                card.modifyStrength(value, true);
            },
            unapply: function(card) {
                card.modifyStrength(-value, false);
            },
            order: value >= 0 ? 0 : 1000
        };
    },
    setStrength: function(value) {
        return {
            gameAction: card => card.getType() === 'character' && card.getStrength() > value ? 'decreaseStrength' : 'increaseStrength',
            apply: function(card) {
                card.strengthSet = value;
            },
            unapply: function(card) {
                card.strengthSet = undefined;
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
    dynamicDominanceStrength: function(calculate) {
        return {
            apply: function(card, context) {
                context.dynamicDominanceStrength = context.dynamicDominanceStrength || {};
                context.dynamicDominanceStrength[card.uuid] = calculate(card, context) || 0;
                card.modifyDominanceStrength(context.dynamicDominanceStrength[card.uuid], true);
            },
            reapply: function(card, context) {
                let currentDominanceStrength = context.dynamicDominanceStrength[card.uuid];
                let newDominanceStrength = calculate(card, context) || 0;
                context.dynamicDominanceStrength[card.uuid] = newDominanceStrength;
                card.modifyDominanceStrength(newDominanceStrength - currentDominanceStrength, true);
            },
            unapply: function(card, context) {
                card.modifyDominanceStrength(-context.dynamicDominanceStrength[card.uuid], false);
                delete context.dynamicDominanceStrength[card.uuid];
            },
            isStateDependent: true
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
    dynamicInitiative: function(calculate) {
        return {
            apply: function(card, context) {
                context.dynamicInitiative = context.dynamicInitiative || {};
                context.dynamicInitiative[card.uuid] = calculate(card, context) || 0;
                card.initiativeModifier += context.dynamicInitiative[card.uuid];
            },
            reapply: function(card, context) {
                let currentInitiative = context.dynamicInitiative[card.uuid];
                let newInitiative = calculate(card, context) || 0;
                context.dynamicInitiative[card.uuid] = newInitiative;
                card.initiativeModifier += newInitiative - currentInitiative;
            },
            unapply: function(card, context) {
                card.initiativeModifier -= context.dynamicInitiative[card.uuid];
                delete context.dynamicInitiative[card.uuid];
            },
            isStateDependent: true
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
    setClaim: function(value) {
        return {
            apply: function(card) {
                card.claimSet = value;
            },
            unapply: function(card) {
                card.claimSet = undefined;
            }
        };
    },
    dynamicClaim: function(calculate) {
        return {
            apply: function(card, context) {
                context.dynamicClaim = context.dynamicClaim || {};
                context.dynamicClaim[card.uuid] = calculate(card, context) || 0;
                card.claimModifier += context.dynamicClaim[card.uuid];
            },
            reapply: function(card, context) {
                let currentClaim = context.dynamicClaim[card.uuid];
                let newClaim = calculate(card, context) || 0;
                context.dynamicClaim[card.uuid] = newClaim;
                card.claimModifier += newClaim - currentClaim;
            },
            unapply: function(card, context) {
                card.claimModifier -= context.dynamicClaim[card.uuid];
                delete context.dynamicClaim[card.uuid];
            },
            isStateDependent: true
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
    dynamicStrength: function(calculate, gameAction = 'increaseStrength') {
        return {
            gameAction: gameAction,
            apply: function(card, context) {
                context.dynamicStrength = context.dynamicStrength || {};
                context.dynamicStrength[card.uuid] = calculate(card, context) || 0;
                let value = context.dynamicStrength[card.uuid];
                card.modifyStrength(value, true);
            },
            reapply: function(card, context) {
                let currentStrength = context.dynamicStrength[card.uuid];
                let newStrength = calculate(card, context) || 0;
                context.dynamicStrength[card.uuid] = newStrength;
                let value = newStrength - currentStrength;
                card.modifyStrength(value, true);
            },
            unapply: function(card, context) {
                let value = context.dynamicStrength[card.uuid];
                card.modifyStrength(-value, false);
                delete context.dynamicStrength[card.uuid];
            },
            isStateDependent: true
        };
    },
    dynamicDecreaseStrength: function(calculate) {
        let negatedCalculate = (card, context) => -(calculate(card, context) || 0);
        return Effects.dynamicStrength(negatedCalculate, 'decreaseStrength');
    },
    doesNotContributeStrength: challengeOptionEffect('doesNotContributeStrength'),
    doesNotReturnUnspentGold: function() {
        return {
            targetType: 'player',
            apply: function(player) {
                player.doesNotReturnUnspentGold = true;
            },
            unapply: function(player) {
                player.doesNotReturnUnspentGold = false;
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
    dynamicIcons: function(iconsFunc) {
        return {
            apply: function(card, context) {
                context.dynamicIcons = context.dynamicIcons || {};
                context.dynamicIcons[card.uuid] = iconsFunc(card, context) || 0;
                _.each(context.dynamicIcons[card.uuid], icon => card.addIcon(icon));
            },
            reapply: function(card, context) {
                _.each(context.dynamicIcons[card.uuid], icon => card.removeIcon(icon));
                context.dynamicIcons[card.uuid] = iconsFunc(card, context);
                _.each(context.dynamicIcons[card.uuid], icon => card.addIcon(icon));
            },
            unapply: function(card, context) {
                _.each(context.dynamicIcons[card.uuid], icon => card.removeIcon(icon));
                delete context.dynamicIcons[card.uuid];
            },
            isStateDependent: true
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
    dynamicKeywords: function(keywordsFunc) {
        return {
            apply: function(card, context) {
                context.dynamicKeywords = context.dynamicKeywords || {};
                context.dynamicKeywords[card.uuid] = keywordsFunc(card, context) || 0;
                _.each(context.dynamicKeywords[card.uuid], keyword => card.addKeyword(keyword));
            },
            reapply: function(card, context) {
                _.each(context.dynamicKeywords[card.uuid], icon => card.removeKeyword(icon));
                context.dynamicKeywords[card.uuid] = keywordsFunc(card, context);
                _.each(context.dynamicKeywords[card.uuid], keyword => card.addKeyword(keyword));
            },
            unapply: function(card, context) {
                _.each(context.dynamicKeywords[card.uuid], keyword => card.removeKeyword(keyword));
                delete context.dynamicKeywords[card.uuid];
            },
            isStateDependent: true
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
    losesAllFactions: losesAspectEffect('factions'),
    losesAllKeywords: losesAspectEffect('keywords'),
    losesAllTraits: losesAspectEffect('traits'),
    loseFaction: function(faction) {
        return losesAspectEffect(`factions.${faction.toLowerCase()}`)();
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
    removeTrait: function(trait) {
        return {
            apply: function(card) {
                card.removeTrait(trait);
            },
            unapply: function(card) {
                card.addTrait(trait);
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
    burn: {
        apply: function(card) {
            card.isBurning = true;
        },
        unapply: function(card) {
            card.isBurning = false;
        }
    },
    killByStrength: function(value) {
        return [
            Effects.burn,
            Effects.modifyStrength(value)
        ];
    },
    blankExcludingTraits: {
        apply: function(card) {
            card.setBlank('excludingTraits');
        },
        unapply: function(card) {
            card.clearBlank('excludingTraits');
        }
    },
    fullBlank: {
        apply: function(card) {
            card.setBlank('full');
        },
        unapply: function(card) {
            card.clearBlank('full');
        }
    },
    poison: {
        apply: function(card, context) {
            card.modifyToken('poison', 1);
            context.game.addMessage('{0} uses {1} to place 1 poison token on {2}', context.source.controller, context.source, card);
        },
        unapply: function(card, context) {
            if(card.location === 'play area' && card.hasToken('poison')) {
                card.modifyToken('poison', -1);
                card.controller.killCharacter(card);
                context.game.addMessage('{0} uses {1} to kill {2} at the end of the phase', context.source.controller, context.source, card);
            }
        }
    },
    gainAmbush: function(costModifier = 0) {
        return {
            apply: function(card) {
                let keyword = `Ambush (${card.translateXValue(card.getPrintedCost()) + costModifier})`;
                card.addKeyword(keyword);
            },
            unapply: function(card) {
                let keyword = `Ambush (${card.translateXValue(card.getPrintedCost()) + costModifier})`;
                card.removeKeyword(keyword);
            }
        };
    },
    setEventPlacementLocation: function(location) {
        return {
            apply: function(card) {
                card.eventPlacementLocation = location;
            },
            unapply: function(card) {
                card.eventPlacementLocation = 'discard pile';
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
    moveToBottomOfDeckIfStillInPlay: function(allowSave = true) {
        return {
            apply: function(card, context) {
                context.moveToBottomOfDeckIfStillInPlay = context.moveToBottomOfDeckIfStillInPlay || [];
                context.moveToBottomOfDeckIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(['play area', 'duplicate'].includes(card.location) && context.moveToBottomOfDeckIfStillInPlay.includes(card)) {
                    context.moveToBottomOfDeckIfStillInPlay = _.reject(context.moveToBottomOfDeckIfStillInPlay, c => c === card);
                    card.owner.moveCardToBottomOfDeck(card, allowSave);
                    context.game.addMessage('{0} moves {1} to the bottom of its owner\'s deck at the end of the phase because of {2}', context.source.controller, card, context.source);
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
    shuffleIntoDeckIfStillInPlay: function(allowSave = true) {
        return {
            apply: function(card, context) {
                context.shuffleIntoDeckIfStillInPlay = context.shuffleIntoDeckIfStillInPlay || [];
                context.shuffleIntoDeckIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(card.location === 'play area' && context.shuffleIntoDeckIfStillInPlay.includes(card)) {
                    context.shuffleIntoDeckIfStillInPlay = _.reject(context.shuffleIntoDeckIfStillInPlay, c => c === card);
                    card.owner.shuffleCardIntoDeck(card, allowSave);
                    context.game.addMessage('{0} shuffles {1} into their deck at the end of the phase because of {2}', card.owner, card, context.source);
                }
            }
        };
    },
    removeFromGame: function() {
        return {
            apply: function(card) {
                card.owner.removeCardFromGame(card);
            },
            unapply: function(card, context) {
                if(card.location === 'out of game') {
                    card.owner.putIntoPlay(card, 'play', { isEffectExpiration: true });
                    context.game.addMessage('{0} is put into play because of {1}', card, context.source);
                }
            }
        };
    },
    doesNotContributeToDominance: dominanceOptionEffect('doesNotContribute'),
    contributesToDominanceWhileKneeling: dominanceOptionEffect('contributesWhileKneeling'),
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
        return {
            apply: function(card, context) {
                let restriction = new ImmunityRestriction(cardCondition, context.source);
                context.immuneTo = context.immuneTo || {};
                context.immuneTo[card.uuid] = restriction;
                card.addAbilityRestriction(restriction);
            },
            unapply: function(card, context) {
                let restriction = context.immuneTo[card.uuid];
                card.removeAbilityRestriction(restriction);
                delete context.immuneTo[card.uuid];
            }
        };
    },
    takeControl: function(newController) {
        return {
            apply: function(card, context) {
                let finalController = typeof newController === 'function' ? newController() : newController;
                context.game.takeControl(finalController, card, context.source);
                context.game.addMessage('{0} uses {1} to take control of {2}', context.source.controller, context.source, card);
            },
            unapply: function(card, context) {
                context.game.revertControl(card, context.source);
            }
        };
    },
    cannotMarshalOrPutIntoPlayByTitle: function(name) {
        let restriction = card => card.name === name;
        return this.cannotPutIntoPlay(restriction);
    },
    cannotMarshal: function(condition) {
        let restriction = (card, playingType) => playingType === 'marshal' && condition(card);
        return this.cannotPutIntoPlay(restriction);
    },
    cannotPlay: function(condition) {
        let restriction = (card, playingType) => card.getType() === 'event' && playingType === 'play' && condition(card);
        return this.cannotPutIntoPlay(restriction);
    },
    cannotPutIntoPlay: function(restriction) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.playCardRestrictions.push(restriction);
            },
            unapply: function(player) {
                player.playCardRestrictions = _.reject(player.playCardRestrictions, r => r === restriction);
            }
        };
    },
    cannotBeBypassedByStealth: cannotEffect('bypassByStealth'),
    cannotBeDiscarded: cannotEffect('discard'),
    cannotBeKneeled: cannotEffect('kneel'),
    cannotBeStood: cannotEffect('stand'),
    cannotBeKilled: cannotEffect('kill'),
    cannotBeSaved: cannotEffect('save'),
    cannotBePutIntoShadows: cannotEffect('putIntoShadows'),
    cannotBeRemovedFromGame: cannotEffect('removeFromGame'),
    cannotBeReturnedToHand: cannotEffect('returnToHand'),
    cannotBeSacrificed: cannotEffect('sacrifice'),
    cannotIncreaseStrength: cannotEffect('increaseStrength'),
    cannotDecreaseStrength: cannotEffect('decreaseStrength'),
    cannotGainPower: cannotEffect('gainPower'),
    cannotGainGold: function() {
        return {
            targetType: 'player',
            apply: function(player) {
                player.maxGoldGain.setMax(0);
            },
            unapply: function(player) {
                player.maxGoldGain.removeMax(0);
            }
        };
    },
    cannotTarget: cannotEffect('target'),
    setMaxGoldGain: function(max) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.maxGoldGain.setMax(max);
            },
            unapply: function(player) {
                player.maxGoldGain.removeMax(max);
            }
        };
    },
    setMaxCardDraw: function(max) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.maxCardDraw.setMax(max);
            },
            unapply: function(player) {
                player.maxCardDraw.removeMax(max);
            }
        };
    },
    cannotGainChallengeBonus: function() {
        return {
            targetType: 'player',
            apply: function(player) {
                player.cannotGainChallengeBonus = true;
            },
            unapply: function(player) {
                player.cannotGainChallengeBonus = false;
            }
        };
    },
    cannotWinGame: function() {
        return {
            targetType: 'player',
            apply: function(player) {
                player.cannotWinGame = true;
            },
            unapply: function(player, context) {
                player.cannotWinGame = false;
                context.game.checkWinCondition(player);
            }
        };
    },
    cannotTriggerCardAbilities: function(restriction = () => true) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.triggerRestrictions.push(restriction);
            },
            unapply: function(player) {
                player.triggerRestrictions = _.reject(player.triggerRestrictions, r => r === restriction);
            }
        };
    },
    modifyDrawPhaseCards: function(value) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.drawPhaseCards += value;
            },
            unapply: function(player) {
                player.drawPhaseCards -= value;
            }
        };
    },
    modifyMaxLimited: function(amount) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.maxLimited += amount;
            },
            unapply: function(player) {
                player.maxLimited -= amount;
            }
        };
    },
    mayInitiateAdditionalChallenge: function(challengeType, opponentFunc) {
        let allowedChallenge = new AllowedChallenge(challengeType, opponentFunc);
        return {
            targetType: 'player',
            apply: function(player) {
                player.addAllowedChallenge(allowedChallenge);
            },
            unapply: function(player) {
                player.removeAllowedChallenge(allowedChallenge);
            }
        };
    },
    cannotInitiateChallengeAgainst(opponent) {
        return this.cannotInitiateChallengeType('any', o => o === opponent);
    },
    cannotInitiateChallengeType(challengeType, opponentCondition = () => true) {
        let restriction = new ChallengeRestriction(challengeType, opponentCondition);
        return {
            targetType: 'player',
            apply: function(player) {
                player.addChallengeRestriction(restriction);
            },
            unapply: function(player) {
                player.removeChallengeRestriction(restriction);
            }
        };
    },
    canSpendGold: function(allowSpendingFunc) {
        return {
            apply: function(card, context) {
                let goldSource = new GoldSource(card, allowSpendingFunc);
                context.canSpendGold = context.canSpendGold || {};
                context.canSpendGold[card.uuid] = goldSource;
                card.controller.addGoldSource(goldSource);
            },
            unapply: function(card, context) {
                let goldSource = context.canSpendGold[card.uuid];
                card.controller.removeGoldSource(goldSource);
                delete context.canSpendGold[card.uuid];
            }
        };
    },
    setMaxChallenge: function(max) {
        return {
            targetType: 'player',
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
            targetType: 'player',
            apply: function(player, context) {
                context.setMinReserve = context.setMinReserve || {};
                context.setMinReserve[player.name] = player.minReserve;
                player.minReserve = min;
            },
            unapply: function(player, context) {
                player.minReserve = context.setMinReserve[player.name];
                delete context.setMinReserve[player.name];
            }
        };
    },
    setMinCost: function(value) {
        return {
            targetType: 'player',
            apply: function(player, context) {
                context.source.minCost = value;
            },
            unapply: function(player, context) {
                context.source.minCost = 0;
            }
        };
    },
    contributeChallengeStrength: function(value) {
        return {
            targetType: 'player',
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
    setAttackerMaximum: function(value) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.attackerLimits.setMax(value);
            },
            unapply: function(player) {
                player.attackerLimits.removeMax(value);
            }
        };
    },
    setDefenderMinimum: function(value) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.defenderLimits.setMin(value);
            },
            unapply: function(player) {
                player.defenderLimits.removeMin(value);
            }
        };
    },
    setDefenderMaximum: function(value) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.defenderLimits.setMax(value);
            },
            unapply: function(player) {
                player.defenderLimits.removeMax(value);
            }
        };
    },
    cannotWinChallenge: function() {
        return {
            targetType: 'player',
            apply: function(player) {
                player.cannotWinChallenge = true;
            },
            unapply: function(player) {
                player.cannotWinChallenge = false;
            }
        };
    },
    canPlay: function(predicate) {
        let playableLocation = new PlayableLocation('play', predicate);
        return {
            targetType: 'player',
            apply: function(player) {
                player.playableLocations.push(playableLocation);
            },
            unapply: function(player) {
                player.playableLocations = player.playableLocations.filter(l => l !== playableLocation);
            }
        };
    },
    canMarshal: function(predicate) {
        let playableLocation = new PlayableLocation('marshal', predicate);
        return {
            targetType: 'player',
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
            targetType: 'player',
            apply: function(player, context) {
                let playableLocation = new PlayableLocation('play', card => card.controller === player && card.location === location);
                context.canPlayFromOwn = context.canPlayFromOwn || {};
                context.canPlayFromOwn[player.name] = playableLocation;
                player.playableLocations.push(playableLocation);
            },
            unapply: function(player, context) {
                player.playableLocations = _.reject(player.playableLocations, l => l === context.canPlayFromOwn[player.name]);
                delete context.canPlayFromOwn[player.name];
            }
        };
    },
    canSelectAsFirstPlayer: function(condition) {
        return {
            targetType: 'player',
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
            targetType: 'player',
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
            targetType: 'player',
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
    reduceSelfCost: function(playingTypes, amount) {
        return {
            targetType: 'player',
            apply: function(player, context) {
                context.reducers = context.reducers || [];
                let reducer = new CostReducer(context.game, context.source, {
                    playingTypes: playingTypes,
                    amount: amount,
                    match: card => card === context.source
                });
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
    reduceNextAmbushedOrPlayedCardCost: function(amount, match) {
        return this.reduceNextCardCost(['ambush', 'play'], amount, match);
    },
    reduceNextMarshalledOrPlayedCardCost: function(amount, match) {
        return this.reduceNextCardCost(['marshal', 'play'], amount, match);
    },
    reduceNextMarshalledPlayedOrAmbushedCardCost: function(amount, match) {
        return this.reduceNextCardCost(['marshal', 'play', 'ambush'], amount, match);
    },
    reduceNextMarshalledAmbushedOrOutOfShadowsCardCost: function(amount, match) {
        return this.reduceNextCardCost(['marshal', 'ambush', 'outOfShadows'], amount, match);
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
            targetType: 'player',
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
    mustChooseAsClaim: function(card) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.mustChooseAsClaim.push(card);
            },
            unapply: function(player) {
                player.mustChooseAsClaim = _.reject(player.mustChooseAsClaim, c => c === card);
            }
        };
    },
    skipPhase: function(name) {
        return {
            targetType: 'game',
            apply: function(game) {
                game.skipPhase[name] = true;
            },
            unapply: function(game) {
                game.skipPhase[name] = false;
            }
        };
    },
    notConsideredToBeInPlotDeck: function() {
        return {
            apply: function(card) {
                card.notConsideredToBeInPlotDeck = true;
            },
            unapply: function(card) {
                card.notConsideredToBeInPlotDeck = false;
            }
        };
    },
    mustRevealPlot: function(card) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.mustRevealPlot = card;
            },
            unapply: function(player) {
                player.mustRevealPlot = undefined;
            }
        };
    },
    applyClaimToMultipleOpponents: function(claimType) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.multipleOpponentClaim.push(claimType);
            },
            unapply: function(player) {
                player.multipleOpponentClaim = player.multipleOpponentClaim.filter(c => c === claimType);
            }
        };
    },
    revealTopCard: function() {
        return {
            targetType: 'player',
            apply: function(player, context) {
                let revealFunc = (card) => player.drawDeck.length > 0 && player.drawDeck[0] === card;

                context.revealTopCard = context.revealTopCard || {};
                context.revealTopCard[player.name] = revealFunc;
                context.game.cardVisibility.addRule(revealFunc);
            },
            unapply: function(player, context) {
                let revealFunc = context.revealTopCard[player.name];

                context.game.cardVisibility.removeRule(revealFunc);
                delete context.revealTopCard[player.name];
            }
        };
    },
    //Meereen only effect
    removeCardsFromHand: function() {
        return {
            targetType: 'player',
            apply: function(player, context) {
                for(let card of player.hand) {
                    player.removeCardFromPile(card);
                    context.source.addChildCard(card, 'underneath');
                    card.facedown = true;
                }
            },
            unapply: function(player, context) {
                player.discardCards(player.hand);
                for(let card of context.source.childCards.filter(card => card.controller === player && card.location === 'underneath')) {
                    player.moveCard(card, 'hand');
                }
                context.game.addMessage('{0} discards their hand and returns each card under {1} to their hand',
                    player, context.source);
            }
        };
    }
};

module.exports = Effects;
