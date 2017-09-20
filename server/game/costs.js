const _ = require('underscore');
const ChooseCost = require('./costs/choosecost.js');
const PayXGoldPrompt = require('./costs/payxgoldprompt.js');

const Costs = {
    /**
     * Cost that aggregates a list of other costs.
     */
    all: function(...costs) {
        return {
            canPay: function(context) {
                return _.all(costs, cost => cost.canPay(context));
            },
            pay: function(context) {
                _.each(costs, cost => cost.pay(context));
            }
        };
    },
    /**
     * Cost that allows the player to choose between multiple costs. The
     * `choices` object should have string keys representing the button text
     * that will be used to prompt the player, with the values being the cost
     * associated with that choice.
     */
    choose: function(choices) {
        return new ChooseCost(choices);
    },
    /**
     * Cost that will kneel the card that initiated the ability.
     */
    kneelSelf: function() {
        return {
            canPay: function(context) {
                return !context.source.kneeled;
            },
            pay: function(context) {
                context.source.controller.kneelCard(context.source);
            },
            canUnpay: function(context) {
                return context.source.kneeled;
            },
            unpay: function(context) {
                context.source.controller.standCard(context.source);
            }
        };
    },
    /**
     * Cost that will kneel the parent card the current card is attached to.
     */
    kneelParent: function() {
        return {
            canPay: function(context) {
                return !!context.source.parent && !context.source.parent.kneeled;
            },
            pay: function(context) {
                context.source.parent.controller.kneelCard(context.source.parent);
            }
        };
    },
    /**
     * Cost that will kneel the player's faction card.
     */
    kneelFactionCard: function() {
        return {
            canPay: function(context) {
                return !context.player.faction.kneeled;
            },
            pay: function(context) {
                context.player.kneelCard(context.player.faction);
            }
        };
    },
    /**
     * Cost that kneels a specific card passed into the function
     */
    kneelSpecific: function(cardFunc) {
        return {
            canPay: function(context) {
                let card = cardFunc(context);
                return !card.kneeled;
            },
            pay: function(context) {
                let card = cardFunc(context);
                context.player.kneelCard(card);
            }
        };
    },
    /**
     * Cost that requires kneeling a card that matches the passed condition
     * predicate function.
     */
    kneel: function(condition) {
        var fullCondition = (card, context) => (
            !card.kneeled &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to kneel',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.kneelingCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.kneelCard(context.kneelingCostCard);
            }
        };
    },
    /**
     * Cost that requires kneeling a certain number of cards that match the
     * passed condition predicate function.
     */
    kneelMultiple: function(number, condition) {
        var fullCondition = (card, context) => (
            !card.kneeled &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.getNumberOfCardsInPlay(card => fullCondition(card, context)) >= number;
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select ' + number + ' cards to kneel',
                    numCards: number,
                    multiSelect: true,
                    source: context.source,
                    onSelect: (player, cards) => {
                        if(cards.length !== number) {
                            return false;
                        }

                        context.kneelingCostCards = cards;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                _.each(context.kneelingCostCards, card => {
                    context.player.kneelCard(card);
                });
            }
        };
    },
    /**
     * Cost that will sacrifice the card that initiated the ability.
     */
    sacrificeSelf: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.source.controller.sacrificeCard(context.source);
            }
        };
    },
    /**
     * Cost that requires sacrificing a card that matches the passed condition
     * predicate function.
     */
    sacrifice: function(condition) {
        var fullCondition = (card, context) => (
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to sacrifice',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.sacrificeCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.sacrificeCard(context.sacrificeCostCard);
            }
        };
    },
    /**
     * Cost that will put into play the card that initiated the ability.
     */
    putSelfIntoPlay: function() {
        return {
            canPay: function(context) {
                return context.source.controller.canPutIntoPlay(context.source);
            },
            pay: function(context) {
                context.source.controller.putIntoPlay(context.source);
            }
        };
    },
    /**
     * Cost that will remove from game the card that initiated the ability.
     */
    removeSelfFromGame: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.source.controller.moveCard(context.source, 'out of game');
            }
        };
    },
    /**
     * Cost that requires you return a card matching the condition to the
     * player's hand.
     */
    returnToHand: function(condition) {
        var fullCondition = (card, context) => (
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to return to hand',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.costs.returnedToHandCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.returnCardToHand(context.costs.returnedToHandCard, false);
            }
        };
    },
    /**
     * Cost that will return to hand the card that initiated the ability.
     */
    returnSelfToHand: function() {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                context.source.controller.returnCardToHand(context.source, false);
            }
        };
    },
    /**
     * Cost that reveals a specific card passed into the function
     */
    revealSpecific: function(cardFunc) {
        return {
            canPay: function() {
                return true;
            },
            pay: function(context) {
                let card = cardFunc(context);
                context.game.addMessage('{0} reveals {1} from their hand', context.player, card);
            }
        };
    },
    /**
     * Cost that requires revealing a certain number of cards in hand that match
     * the passed condition predicate function.
     */
    revealCards: function(number, condition) {
        var fullCondition = (card, context) => (
            card.location === 'hand' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                let potentialCards = context.player.findCards(context.player.hand, card => fullCondition(card, context));
                return _.size(potentialCards) >= number;
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select ' + number + ' cards to reveal',
                    numCards: number,
                    multiSelect: true,
                    source: context.source,
                    onSelect: (player, cards) => {
                        if(cards.length !== number) {
                            return false;
                        }

                        context.revealingCostCards = cards;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.game.addMessage('{0} reveals {1} from their hand', context.player, context.revealingCostCards);
            }
        };
    },
    /**
     * Cost that will stand the card that initiated the ability (e.g.,
     * Barristan Selmy (TS)).
     */
    standSelf: function() {
        return {
            canPay: function(context) {
                return context.source.kneeled;
            },
            pay: function(context) {
                context.source.controller.standCard(context.source);
            }
        };
    },
    /**
     * Cost that will stand the parent card the current card is attached to.
     */
    standParent: function() {
        return {
            canPay: function(context) {
                return !!context.source.parent && context.source.parent.kneeled;
            },
            pay: function(context) {
                context.source.parent.controller.standCard(context.source.parent);
            }
        };
    },
    /**
     * Cost that will remove the parent card the current card is attached to from the challenge.
     */
    removeParentFromChallenge: function(challengeFunc) {
        return {
            canPay: function(context) {
                let challenge = challengeFunc();
                return !!context.source.parent && challenge.isParticipating(context.source.parent);
            },
            pay: function(context) {
                let challenge = challengeFunc();
                challenge.removeFromChallenge(context.source.parent);
            }
        };
    },
    /**
     * Cost that will place the played event card in the player's discard pile.
     */
    expendEvent: function() {
        return {
            canPay: function(context) {
                return context.player.isCardInPlayableLocation(context.source, 'play') && context.player.canPlay(context.source, 'play');
            },
            pay: function(context) {
                context.source.controller.moveCard(context.source, 'discard pile');
            }
        };
    },
    /**
     * Cost that requires discarding a card from hand matching the passed
     * condition predicate function.
     */
    discardFromHand: function(condition = () => true) {
        var fullCondition = (card, context) => (
            card.location === 'hand' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.allCards.any(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to discard',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.discardCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.player.discardCard(context.discardCostCard);
            }
        };
    },
    /**
     * Cost that will pay the reduceable gold cost associated with an event card
     * and place it in discard.
     */
    playEvent: function() {
        return Costs.all(
            Costs.payReduceableGoldCost('play'),
            Costs.expendEvent(),
            Costs.playLimited(),
            Costs.playMax()
        );
    },
    /**
     * Cost that will discard a gold from the card. Used mainly by cards
     * having the bestow keyword.
     */
    discardGold: function() {
        return {
            canPay: function(context) {
                return context.source.hasToken('gold');
            },
            pay: function(context) {
                context.source.removeToken('gold', 1);
            }
        };
    },
    /**
     * Cost that will discard a fixed amount of power from the current card.
     */
    discardPowerFromSelf: function(amount = 1) {
        return {
            canPay: function(context) {
                return context.source.power >= amount;
            },
            pay: function(context) {
                context.source.modifyPower(-amount);
            }
        };
    },
    /**
     * Cost that will discard a fixed amount of a passed type token from the current card.
     */
    discardTokenFromSelf: function(type, amount = 1) {
        return {
            canPay: function(context) {
                return context.source.tokens[type] >= amount;
            },
            pay: function(context) {
                context.source.removeToken(type, amount);
            }
        };
    },
    /**
     * Cost that will discard faction power matching the passed amount.
     */
    discardFactionPower: function(amount) {
        return {
            canPay: function(context) {
                return context.player.faction.power >= amount;
            },
            pay: function(context) {
                context.source.game.addPower(context.player, -amount);
            }
        };
    },
    /**
     * Cost that requires discarding a power from a card that matches the passed condition
     * predicate function.
     */
    discardPower: function(amount, condition) {
        var fullCondition = (card, context) => (
            card.getPower() >= amount &&
            card.location === 'play area' &&
            card.controller === context.player &&
            condition(card)
        );
        return {
            canPay: function(context) {
                return context.player.anyCardsInPlay(card => fullCondition(card, context));
            },
            resolve: function(context, result = { resolved: false }) {
                context.game.promptForSelect(context.player, {
                    cardCondition: card => fullCondition(card, context),
                    activePromptTitle: 'Select card to discard ' + amount + ' power from',
                    source: context.source,
                    onSelect: (player, card) => {
                        context.discardPowerCostCard = card;
                        result.value = true;
                        result.resolved = true;

                        return true;
                    },
                    onCancel: () => {
                        result.value = false;
                        result.resolved = true;
                    }
                });

                return result;
            },
            pay: function(context) {
                context.discardPowerCostCard.modifyPower(-amount);
            }
        };
    },
    /**
     * Cost that ensures that the player can still play a Limited card this
     * round.
     */
    playLimited: function() {
        return {
            canPay: function(context) {
                return !context.source.isLimited() || context.player.limitedPlayed < context.player.maxLimited;
            },
            pay: function(context) {
                if(context.source.isLimited()) {
                    context.player.limitedPlayed += 1;
                }
            }
        };
    },
    /**
     * Cost that ensures that the player has not exceeded the maximum usage for
     * an ability.
     */
    playMax: function() {
        return {
            canPay: function(context) {
                return !context.player.isAbilityAtMax(context.source.name);
            },
            pay: function(context) {
                context.player.incrementAbilityMax(context.source.name);
            }
        };
    },
    /**
     * Cost that will pay the exact printed gold cost for the card.
     */
    payPrintedGoldCost: function() {
        return {
            canPay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                if(hasDupe) {
                    return true;
                }

                return context.player.gold >= context.source.getCost();
            },
            pay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                if(hasDupe) {
                    return;
                }

                context.player.gold -= context.source.getCost();
            }
        };
    },
    /**
     * Cost that will pay the printed gold cost on the card minus any active
     * reducer effects the play has activated. Upon playing the card, all
     * matching reducer effects will expire, if applicable.
     */
    payReduceableGoldCost: function(playingType) {
        return {
            canPay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                if(hasDupe && playingType === 'marshal') {
                    return true;
                }

                return context.player.gold >= context.player.getReducedCost(playingType, context.source);
            },
            pay: function(context) {
                var hasDupe = context.player.getDuplicateInPlay(context.source);
                context.costs.isDupe = !!hasDupe;
                if(hasDupe && playingType === 'marshal') {
                    context.costs.gold = 0;
                } else {
                    context.costs.gold = context.player.getReducedCost(playingType, context.source);
                    context.player.gold -= context.costs.gold;
                    context.player.markUsedReducers(playingType, context.source);
                }
            }
        };
    },
    /**
     * Cost in which the player must pay a fixed, non-reduceable amount of gold.
     */
    payGold: function(amount) {
        return {
            canPay: function(context) {
                return context.player.gold >= amount;
            },
            pay: function(context) {
                context.game.addGold(context.player, -amount);
            }
        };
    },
    /**
     * Cost where the player gets prompted to pay from 1 up to the lesser of two values:
     * the passed value and either the player's or his opponent's gold.
     * Used by Ritual of R'hllor, Loot and The Things I Do For Love.
     * TODO: needs to be reducable for cards like Littlefinger's Meddling and Paxter Redwyne.
     */
    payXGold: function(minFunc, maxFunc, opponentFunc) {
        return {
            canPay: function(context) {
                let opponentObj = opponentFunc && opponentFunc(context);
                if(!opponentObj) {
                    return context.player.gold >= minFunc(context);
                }
                return opponentObj.gold >= minFunc(context);
            },
            resolve: function(context, result = { resolved: false }) {
                let opponentObj = opponentFunc && opponentFunc(context);
                let gold = opponentObj ? opponentObj.gold : context.player.gold;
                let max = _.min([maxFunc(context), gold]);

                context.game.queueStep(new PayXGoldPrompt(minFunc(context), max, context));

                result.value = true;
                result.resolved = true;
                return result;
            },
            pay: function(context) {
                let opponentObj = opponentFunc && opponentFunc(context);
                if(!opponentObj) {
                    context.game.addGold(context.player, -context.goldCostAmount);
                } else {
                    context.game.addGold(opponentObj, -context.goldCostAmount);
                }
            }
        };
    }
};

module.exports = Costs;
