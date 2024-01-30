const AbilityLimit = require('./abilitylimit.js');
const AllowedChallenge = require('./AllowedChallenge');
const CardMatcher = require('./CardMatcher');
const CardTextDefinition = require('./CardTextDefinition');
const {ValueContribution, CharacterStrengthContribution} = require('./ChallengeContributions');
const CostReducer = require('./costreducer.js');
const GameActions = require('./GameActions');
const PlayableLocation = require('./playablelocation.js');
const CannotRestriction = require('./cannotrestriction.js');
const ChallengeRestriction = require('./ChallengeRestriction.js');
const ImmunityRestriction = require('./immunityrestriction.js');
const GoldSource = require('./GoldSource.js');
const {Tokens} = require('./Constants');

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

function powerOptionEffect(key) {
    return function() {
        return {
            apply: function(card) {
                card.powerOptions.add(key);
            },
            unapply: function(card) {
                card.powerOptions.remove(key);
            }
        };
    };
}

function dynamicCardModifier(propName) {
    return function(calculateOrValue) {
        const isStateDependent = (typeof calculateOrValue === 'function');
        const calculate = isStateDependent ? calculateOrValue : () => calculateOrValue;

        return {
            apply: function(card, context) {
                context[propName] = context[propName] || {};
                context[propName][card.uuid] = calculate(card, context) || 0;
                card[propName] += context[propName][card.uuid];
            },
            reapply: function(card, context) {
                let currentInitiative = context[propName][card.uuid];
                let newInitiative = calculate(card, context) || 0;
                context[propName][card.uuid] = newInitiative;
                card[propName] += newInitiative - currentInitiative;
            },
            unapply: function(card, context) {
                card[propName] -= context[propName][card.uuid];
                delete context[propName][card.uuid];
            },
            isStateDependent
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
    doesNotKneelAsAttacker: function({ challengeType = 'any' } = {}) {
        return challengeOptionEffect(`doesNotKneelAsAttacker.${challengeType}`)();
    },
    doesNotKneelAsDefender: function({ challengeType = 'any' } = {}) {
        return challengeOptionEffect(`doesNotKneelAsDefender.${challengeType}`)();
    },
    consideredToBeAttacking: function() {
        return {
            apply: function(card, context) {
                let challenge = context.game.currentChallenge;
                if(card.canParticipateInChallenge() && !challenge.isAttacking(card)) {
                    challenge.addAttacker(card);
                }
            },
            reapply: function(card, context) {
                let challenge = context.game.currentChallenge;
                if(card.canParticipateInChallenge() && !challenge.isAttacking(card)) {
                    challenge.addAttacker(card);
                }
            },
            unapply: function(card, context) {
                let challenge = context.game.currentChallenge;

                if(challenge && challenge.isAttacking(card) && !challenge.isDeclared(card)) {
                    challenge.removeFromChallenge(card);
                }
            },
            isStateDependent: true
        };
    },
    canBeDeclaredWithoutIcon: challengeOptionEffect('canBeDeclaredWithoutIcon'),
    canBeDeclaredWhileKneeling: challengeOptionEffect('canBeDeclaredWhileKneeling'),
    mustBeDeclaredAsAttacker: challengeOptionEffect('mustBeDeclaredAsAttacker'),
    mustBeDeclaredAsDefender: challengeOptionEffect('mustBeDeclaredAsDefender'),
    declareDefendersBeforeAttackers: function() {
        return {
            targetType: 'player',
            apply: function(player, context) {
                if(context.game.currentChallenge) {
                    context.game.currentChallenge.declareDefendersFirst = true;
                }
            },
            unapply: function(player, context) {
                if(context.game.currentChallenge) {
                    context.game.currentChallenge.declareDefendersFirst = false;
                }
            }
        };
    },
    restrictAttachmentsTo: function(trait) {
        return Effects.addKeyword(`No attachments except <i>${trait}</i>`);
    },
    addAttachmentRestriction: function(restriction) {
        return {
            apply: function(card, context) {
                context.addAttachmentRestriction = context.addAttachmentRestriction || {};
                context.addAttachmentRestriction[card.uuid] = typeof(restriction) === 'function' ? restriction : CardMatcher.createAttachmentMatcher(restriction);
                card.addAdditionalAttachmentRestriction(context.addAttachmentRestriction[card.uuid]);
            },
            unapply: function(card, context) {
                card.removeAdditionalAttachmentRestriction(context.addAttachmentRestriction[card.uuid]);
                delete context.addAttachmentRestriction[card.uuid];
            }
        };
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
    modifyGold: dynamicCardModifier('goldModifier'),
    modifyInitiative: dynamicCardModifier('initiativeModifier'),
    modifyReserve: dynamicCardModifier('reserveModifier'),
    modifyClaim: dynamicCardModifier('claimModifier'),
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
    modifyKeywordTriggerAmount: function(keyword, value) {
        return {
            apply: function(card) {
                card.modifyKeywordTriggerAmount(keyword, value);
            },
            unapply: function(card) {
                card.modifyKeywordTriggerAmount(keyword, -value);
            }
        };
    },
    ignoresAssaultLocationCost: challengeOptionEffect('ignoresAssaultLocationCost'),
    addIcon: function(icon) {
        return {
            apply: function(card, context) {
                context.game.resolveGameAction(
                    GameActions.gainIcon({ card, icon, applying: true })
                );
            },
            unapply: function(card, context) {
                context.game.resolveGameAction(
                    GameActions.loseIcon({ card, icon, applying: false })
                );
            }
        };
    },
    dynamicIcons: function(iconsFunc) {
        return {
            apply: function(card, context) {
                context.dynamicIcons = context.dynamicIcons || {};
                context.dynamicIcons[card.uuid] = iconsFunc(card, context) || [];
                context.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.dynamicIcons[card.uuid].map(icon => GameActions.gainIcon({ card, icon, applying: true }))
                    )
                );
            },
            reapply: function(card, context) {
                let currentIcons = context.dynamicIcons[card.uuid];
                context.dynamicIcons[card.uuid] = iconsFunc(card, context);

                let iconsGained = context.dynamicIcons[card.uuid].filter(icon => !currentIcons.includes(icon));
                let iconsLost = currentIcons.filter(icon => !context.dynamicIcons[card.uuid].includes(icon));

                let actions = iconsGained.map(icon => GameActions.gainIcon({ card, icon, applying: true }));
                actions = actions.concat(iconsLost.map(icon => GameActions.loseIcon({ card, icon, applying: false })));

                context.game.resolveGameAction(GameActions.simultaneously(actions));
            },
            unapply: function(card, context) {
                context.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.dynamicIcons[card.uuid].map(icon => GameActions.loseIcon({ card, icon, applying: false }))
                    )
                );
                delete context.dynamicIcons[card.uuid];
            },
            isStateDependent: true
        };
    },
    removeIcon: function(icon) {
        return {
            apply: function(card, context) {
                context.game.resolveGameAction(
                    GameActions.loseIcon({ card, icon, applying: true })
                );
            },
            unapply: function(card, context) {
                context.game.resolveGameAction(
                    GameActions.gainIcon({ card, icon, applying: false })
                );
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
                context.dynamicKeywords[card.uuid] = keywordsFunc(card, context) || [];
                for(let keyword of context.dynamicKeywords[card.uuid]) {
                    card.addKeyword(keyword);
                }
            },
            reapply: function(card, context) {
                for(let keyword of context.dynamicKeywords[card.uuid]) {
                    card.removeKeyword(keyword);
                }
                context.dynamicKeywords[card.uuid] = keywordsFunc(card, context);
                for(let keyword of context.dynamicKeywords[card.uuid]) {
                    card.addKeyword(keyword);
                }
            },
            unapply: function(card, context) {
                for(let keyword of context.dynamicKeywords[card.uuid]) {
                    card.removeKeyword(keyword);
                }
                delete context.dynamicKeywords[card.uuid];
            },
            isStateDependent: true
        };
    },
    dynamicKeywordSources: function(sourceFunc) {
        return {
            apply: function(card) {
                card.keywordSources.push(sourceFunc);
            },
            unapply: function(card) {
                card.keywordSources = card.keywordSources.filter(existingSourceFunc => existingSourceFunc !== sourceFunc);
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
                for(let keyword of keywords) {
                    card.addKeyword(keyword);
                }
            },
            unapply: function(card) {
                for(let keyword of keywords) {
                    card.removeKeyword(keyword);
                }
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
            card.setIsBurning(true);
        },
        unapply: function(card) {
            card.setIsBurning(false);
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
            card.modifyToken(Tokens.poison, 1);
            context.game.addMessage('{0} uses {1} to place 1 poison token on {2}', context.source.controller, context.source, card);
        },
        unapply: function(card, context) {
            if(card.location === 'play area' && card.hasToken(Tokens.poison)) {
                card.modifyToken(Tokens.poison, -1);
                card.controller.killCharacter(card);
                context.game.addMessage('{0} uses {1} to kill {2} at the end of the phase', context.source.controller, context.source, card);
            }
        }
    },
    gainAmbush: function(costModifier = 0) {
        return {
            apply: function(card) {
                let keyword = `Ambush (${Math.max(0, card.translateXValue(card.getPrintedCost()) + costModifier) })`;
                card.addKeyword(keyword);
            },
            unapply: function(card) {
                let keyword = `Ambush (${Math.max(0, card.translateXValue(card.getPrintedCost()) + costModifier) })`;
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
                if(['play area', 'duplicate'].includes(card.location) && context.discardIfStillInPlay.includes(card)) {
                    context.discardIfStillInPlay = context.discardIfStillInPlay.filter(c => c !== card);
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
                    context.killIfStillInPlay = context.killIfStillInPlay.filter(c => c !== card);
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
                if(['play area', 'duplicate'].includes(card.location) && context.moveToDeadPileIfStillInPlay.includes(card)) {
                    context.moveToDeadPileIfStillInPlay = context.moveToDeadPileIfStillInPlay.filter(c => c !== card);
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
                    context.moveToBottomOfDeckIfStillInPlay = context.moveToBottomOfDeckIfStillInPlay.filter(c => c !== card);
                    context.game.resolveGameAction(
                        GameActions.returnCardToDeck({ card, allowSave, bottom: true })
                    );
                    context.game.addMessage('{0} moves {1} to the bottom of its owner\'s deck at the end of the phase because of {2}', context.source.controller, card, context.source);
                }
            }
        };
    },
    returnToHandIfStillInPlay: function(allowSave = false, duration = 'phase') {
        return {
            apply: function(card, context) {
                context.returnToHandIfStillInPlay = context.returnToHandIfStillInPlay || [];
                context.returnToHandIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(['play area', 'duplicate'].includes(card.location) && context.returnToHandIfStillInPlay.includes(card)) {
                    context.returnToHandIfStillInPlay = context.returnToHandIfStillInPlay.filter(c => c !== card);
                    card.controller.returnCardToHand(card, allowSave);
                    context.game.addMessage('{0} returns {1} to hand at the end of the {2} because of {3}', context.source.controller, card, duration, context.source);
                }
            }
        };
    },
    returnToHandIfStillInPlayAndNotAttachedToCardByTitle: function(parentCardTitle, allowSave = false, duration = 'phase') {
        return {
            apply: function(card, context) {
                context.returnToHandIfStillInPlay = context.returnToHandIfStillInPlay || [];
                context.returnToHandIfStillInPlay.push(card);
            },
            unapply: function(card, context) {
                if(['play area', 'duplicate'].includes(card.location) && context.returnToHandIfStillInPlay.includes(card)) {
                    context.returnToHandIfStillInPlay = context.returnToHandIfStillInPlay.filter(c => c !== card);
                    if((card.parent && card.parent.name !== parentCardTitle) || !card.parent) {
                        card.controller.returnCardToHand(card, allowSave);
                        context.game.addMessage('{0} returns {1} to hand at the end of the {2} because of {3}', context.source.controller, card, duration, context.source);
                    }
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
                if(['play area', 'duplicate'].includes(card.location) && context.shuffleIntoDeckIfStillInPlay.includes(card)) {
                    context.shuffleIntoDeckIfStillInPlay = context.shuffleIntoDeckIfStillInPlay.filter(c => c !== card);
                    card.owner.shuffleCardIntoDeck(card, allowSave);
                    context.game.addMessage('{0} shuffles {1} into their deck at the end of the phase because of {2}', card.owner, card, context.source);
                }
            }
        };
    },
    removeFromGame: function() {
        return {
            apply: function(card, context) {
                context.removeFromGame = context.removeFromGame || {};
                context.removeFromGame[card.uuid] = card.location;
                card.owner.removeCardFromGame(card);
            },
            unapply: function(card, context) {
                if(card.location === 'out of game') {
                    let originalLocation = context.removeFromGame[card.uuid];
                    if(originalLocation === 'play area') {
                        card.owner.putIntoPlay(card, 'play', { isEffectExpiration: true });
                    } else {
                        card.owner.moveCard(card, originalLocation);
                    }
                    context.game.addMessage('{0} is put into play because of {1}', card, context.source);
                    delete context.removeFromGame[card.uuid];
                }
            }
        };
    },
    doesNotContributeToDominance: dominanceOptionEffect('doesNotContribute'),
    contributesToDominanceWhileKneeling: dominanceOptionEffect('contributesWhileKneeling'),
    doesNotContributeToPowerTotal: powerOptionEffect('doesNotContribute'),
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
    gainText: function(configureText) {
        const definition = new CardTextDefinition();
        configureText(definition);
        return definition;
    },
    cannotMarshalOrPutIntoPlayByTitle: function(name) {
        let restriction = card => card.name === name;
        return this.cannotPutIntoPlay(restriction);
    },
    cannotMarshal: function(condition) {
        let restriction = (card, playingType) => playingType === 'marshal' && condition(card);
        return this.cannotPutIntoPlay(restriction);
    },
    cannotBringOutOfShadows: function(condition) {
        let restriction = (card, playingType) => playingType === 'outOfShadows' && condition(card);
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
                player.playCardRestrictions = player.playCardRestrictions.filter(r => r !== restriction);
            }
        };
    },
    cannotSetup: function(condition = () => true) {
        let restriction = (card, playingType) => playingType === 'setup' && condition(card);
        return this.cannotPutIntoPlay(restriction);
    },
    cannotSetupIntoShadows: function(condition = () => true) {
        let restriction = (card, playingType) => playingType === 'setup' && condition(card);
        return {
            targetType: 'player',
            apply: function(player) {
                player.putIntoShadowsRestrictions.push(restriction);
            },
            unapply: function(player) {
                player.putIntoShadowsRestrictions = player.putIntoShadowsRestrictions.filter(r => r !== restriction);
            }
        };
    },
    cannotBeTargetedByAssault: cannotEffect('targetByAssault'),
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
    cannotBeReturnedToDeck: cannotEffect('returnCardToDeck'),
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
    cannotTargetUsingAssault: cannotEffect('assault'),
    cannotTargetUsingStealth: cannotEffect('stealth'),
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
            unapply: function(player) {
                player.cannotWinGame = false;
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
                player.triggerRestrictions = player.triggerRestrictions.filter(r => r !== restriction);
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
    contributeCharacterStrength: function(card) {
        let contribution = null;
        return {
            targetType: 'player',
            apply: function(player, context) {
                let challenge = context.game.currentChallenge;
                if(!challenge) {
                    return;
                }

                contribution = new CharacterStrengthContribution(player, card);
                challenge.addContribution(contribution);
            },
            unapply: function(player, context) {
                let challenge = context.game.currentChallenge;
                if(!challenge) {
                    return;
                }
                
                challenge.removeContribution(contribution);
            }
        };
    },
    contributeStrength: function(card, value) {
        let contribution = null;
        return {
            targetType: 'player',
            apply: function(player, context) {
                let challenge = context.game.currentChallenge;
                if(!challenge) {
                    return;
                }
                
                contribution = new ValueContribution(player, card, value);
                challenge.addContribution(contribution);
            },
            unapply: function(player, context) {
                let challenge = context.game.currentChallenge;
                if(!challenge) {
                    return;
                }

                challenge.removeContribution(contribution);
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
        let playableLocation = new PlayableLocation('marshal', CardMatcher.createMatcher(predicate));
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
    canMarshalIntoShadows: function(predicate) {
        let playableLocation = new PlayableLocation('marshalIntoShadows', CardMatcher.createMatcher(predicate));
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
                player.playableLocations = player.playableLocations.filter(l => l !== context.canPlayFromOwn[player.name]);
                delete context.canPlayFromOwn[player.name];
            }
        };
    },
    canAmbush: function(predicate) {
        let playableLocation = new PlayableLocation('ambush', CardMatcher.createMatcher(predicate));
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
    cannotBeFirstPlayer: function() {
        return {
            targetType: 'player',
            apply: function(player) {
                player.flags.add('cannotBeFirstPlayer');
            },
            unapply: function(player) {
                player.flags.remove('cannotBeFirstPlayer');
            }
        };
    },
    cannotGainDominancePower: function() {
        return {
            targetType: 'player',
            apply: function(player) {
                player.flags.add('cannotGainDominancePower');
            },
            unapply: function(player) {
                player.flags.remove('cannotGainDominancePower');
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
                player.standPhaseRestrictions = player.standPhaseRestrictions.filter(r => r !== restriction);
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
                    for(let reducer of context.reducers) {
                        player.removeCostReducer(reducer);
                    }
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
                    for(let reducer of context.reducers) {
                        player.removeCostReducer(reducer);
                    }
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
    reduceNextOutOfShadowsCardCost: function(amount, match) {
        return this.reduceNextCardCost('outOfShadows', amount, match);
    },
    reduceNextMarshalledOrAmbushedCardCost: function(amount, match) {
        return this.reduceNextCardCost(['marshal', 'ambush'], amount, match);
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
    reduceFirstOutOfShadowsCardCostEachRound: function(amount, match) {
        return this.reduceFirstCardCostEachRound(['outOfShadows'], amount, match);
    },
    reduceFirstCardCostEachPhase: function(playingTypes, amount, match) {
        return this.reduceCost({
            playingTypes: playingTypes,
            amount: amount,
            match: match,
            limit: AbilityLimit.perPhase(1)
        });
    },
    reduceFirstPlayedCardCostEachPhase: function(amount, match) {
        return this.reduceFirstCardCostEachPhase('play', amount, match);
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
    dynamicUsedPlotsWithTrait: function(calculate, trait) {
        return {
            targetType: 'player',
            apply: function(player, context) {
                context.dynamicUsedPlotsWithTrait = context.dynamicUsedPlotsWithTrait || {};
                context.dynamicUsedPlotsWithTrait[player.name] = context.dynamicUsedPlotsWithTrait[player.name] || {};
                context.dynamicUsedPlotsWithTrait[player.name][trait] = calculate(player, context) || 0;
                player.modifyUsedPlotsWithTrait(context.dynamicUsedPlotsWithTrait[player.name][trait], trait);
            },
            reapply: function(player, context) {
                let oldValue = context.dynamicUsedPlotsWithTrait[player.name][trait];
                let newValue = calculate(player, context) || 0;
                context.dynamicUsedPlotsWithTrait[player.name][trait] = newValue;
                player.modifyUsedPlotsWithTrait(newValue - oldValue, trait);
            },
            unapply: function(player, context) {
                player.modifyUsedPlotsWithTrait(-context.dynamicUsedPlotsWithTrait[player.name][trait], trait);
                delete context.dynamicUsedPlotsWithTrait[player.name];
            },
            isStateDependent: true
        };
    },
    mustChooseAsClaim: function(cardFunc) {
        return {
            targetType: 'player',
            apply: function(player) {
                player.mustChooseAsClaim.push(cardFunc);
            },
            unapply: function(player) {
                player.mustChooseAsClaim = player.mustChooseAsClaim.filter(c => c !== cardFunc);
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
    mustShowPlotSelection: function(opponent) {
        return {
            targetType: 'player',
            apply: function(player, context) {
                // TODO: - Account for any level of looking loops (eg. PlayerA > PlayerB > PlayerC > PlayerA will cause issue).
                //         This could be fixed with a wider change to account for First Player choosing the priority of simultaneously applying persistent effects.
                player.mustShowPlotSelection.push(opponent);
                // Only add visibility rule if it previously would not have been active
                if(player.mustShowPlotSelection.length === 1) {
                    let revealFunc = (card, viewingPlayer) => card === player.selectedPlot && player.mustShowPlotSelection.includes(viewingPlayer);
                    context.mustShowPlotSelection = context.mustShowPlotSelection || {};
                    context.mustShowPlotSelection[player.name] = revealFunc;
                    context.game.cardVisibility.addRule(revealFunc);
                }
            },
            unapply: function(player, context) {
                player.mustShowPlotSelection = player.mustShowPlotSelection.filter(o => o !== opponent);
                // Only remove visibility rule if there are no more players
                if(player.mustShowPlotSelection.length === 0) {
                    let revealFunc = context.mustShowPlotSelection[player.name];
                    context.game.cardVisibility.removeRule(revealFunc);
                    delete context.mustShowPlotSelection[player.name];
                }
            }
        };
    },
    lookAtTopCard: function() {
        return {
            targetType: 'player',
            apply: function(player, context) {
                let revealFunc = (card, viewingPlayer) => player.drawDeck.length > 0 && player.drawDeck[0] === card && card.controller === player && viewingPlayer === player;

                context.lookAtTopCard = context.lookAtTopCard || {};
                context.lookAtTopCard[player.name] = revealFunc;
                context.game.cardVisibility.addRule(revealFunc);
            },
            unapply: function(player, context) {
                let revealFunc = context.lookAtTopCard[player.name];

                context.game.cardVisibility.removeRule(revealFunc);
                delete context.lookAtTopCard[player.name];
            }
        };
    },
    revealTopCards: function(amount) {
        let topCardsFunc = player => player.drawDeck.slice(0, amount);
        return {
            targetType: 'player',
            apply: function(player, context) {
                const topCards = topCardsFunc(player);
                let revealFunc = reveal => topCardsFunc(player).includes(reveal);

                context.revealTopCards = context.revealTopCards || {};
                context.revealTopCards[player.name] = {
                    revealFunc,
                    revealed: topCards
                };
                context.game.cardVisibility.addRule(revealFunc);

                context.game.resolveGameAction(GameActions.revealTopCards({
                    amount,
                    player,
                    revealWithMessage: false,
                    highlight: false,
                    source: context.source
                }), context);
            },
            reapply: function(player, context) {
                const topCards = topCardsFunc(player);
                const newReveals = topCards.filter(card => !context.revealTopCards[player.name].revealed.includes(card));

                context.revealTopCards[player.name].revealed = topCards;

                // Only trigger reveal event for newly revealed cards
                if(newReveals.length > 0) {
                    context.game.resolveGameAction(GameActions.revealCards({
                        cards: newReveals,
                        player,
                        revealWithMessage: false,
                        highlight: false,
                        source: context.source
                    }), context);
                }
            },
            unapply: function(player, context) {
                const revealFunc = context.revealTopCards[player.name].revealFunc;

                context.game.cardVisibility.removeRule(revealFunc);
                delete context.revealTopCards[player.name];
            },
            isStateDependent: true
        };
    },
    revealShadows: function() {
        return {
            targetType: 'player',
            apply: function(player, context) {
                // making a snapshot of the shadows area through a shallow copy. This way eventual changes to
                // player.shadows array content (first level) are not reflected in the snapshot
                const shadows = [...player.shadows];

                // we define the reveal function just once, so it must be bound to the player to keep track of the
                // content of the shadows area when the function is called by the engine
                const revealFunc = reveal => player.shadows.includes(reveal);
                context.game.cardVisibility.addRule(revealFunc);

                // saving in the context a reference to the revealFunc (so we can remove it from the engine when the
                // effect expires) and the actual snapshot of the cards in the shadows area for which we are resolving
                // the reveal game action (to avoid a second resolution of the same game action in case of reapply)
                context.revealShadows = context.revealShadows || {};
                context.revealShadows[player.name] = {
                    revealFunc,
                    revealed: shadows
                };

                // resolving the 'reveal' game action for cards in shadows (if there are any)
                if(shadows.length > 0) {
                    context.game.resolveGameAction(GameActions.revealCards({
                        cards: shadows,
                        player,
                        revealWithMessage: false,
                        highlight: false,
                        source: context.source
                    }), context);
                }
            },
            reapply: function(player, context) {
                // making a snapshot of the shadows area through a shallow copy. This way eventual changes to
                // player.shadows array content (first level) are not reflected in the snapshot
                const shadows = [...player.shadows];

                // calculating the newly revealed cards
                const newReveals = shadows.filter(card => !context.revealShadows[player.name].revealed.includes(card));

                // updating the context reference with the actual snapshot of the cards in the shadows area
                context.revealShadows[player.name].revealed = shadows;

                // Only trigger reveal event for newly revealed cards (if there are any)
                if(newReveals.length > 0) {
                    context.game.resolveGameAction(GameActions.revealCards({
                        cards: newReveals,
                        player,
                        revealWithMessage: false,
                        highlight: false,
                        source: context.source
                    }), context);
                }
            },
            unapply: function(player, context) {
                const revealFunc = context.revealShadows[player.name].revealFunc;

                context.game.cardVisibility.removeRule(revealFunc);
                delete context.revealShadows[player.name];
            },
            isStateDependent: true
        };
    },
    cannotRevealPlot: function() {
        return {
            targetType: 'player',
            apply: function(player) {
                player.flags.add('cannotRevealPlot');
            },
            unapply: function(player) {
                player.flags.remove('cannotRevealPlot');
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
    },
    placeCardUnderneath: function(unapplyFunc = null) {
        return {
            apply: function(card, context) {
                context.source.controller.removeCardFromPile(card);
                context.source.addChildCard(card, 'underneath');
                card.facedown = true;
            },
            unapply: function(card, context) {
                card.facedown = false;

                if(unapplyFunc) {
                    unapplyFunc(card, context);
                    return;
                }

                if(card.location === 'underneath' && context.source.childCards.some(childCard => childCard === card)) {
                    context.source.controller.discardCard(card);

                    context.game.addMessage('{0} discards {1} from under {2}',
                        context.source.controller, card, context.source);
                }
            }
        };
    }
};

module.exports = Effects;
