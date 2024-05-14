const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const Message = require('../../Message');
const range = require('lodash.range');

class Highgarden extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give characters +STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.location === 'hand' &&
                    card.isFaction('tyrell') &&
                    card.getType() === 'character',
                activePromptTitle: 'Select up to 3 cards',
                type: 'select',
                mode: 'upTo',
                numCards: 3,
                gameAction: 'reveal'
            },
            message:
                '{player} kneels {costs.kneel} to reveal up to 3 Tyrell characters from their hand',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealCards((context) => ({
                        player: context.player,
                        cards: context.target
                    })).then((preThenContext) => ({
                        target: {
                            cardCondition: (card) =>
                                card.getType() === 'character' && card.location === 'play area',
                            activePromptTitle: `Select up to ${preThenContext.target.length} characters`,
                            type: 'select',
                            mode: 'upTo',
                            numCards: preThenContext.target.length,
                            gameAction: 'increaseStrength'
                        },
                        handler: (context) => {
                            this.groups = {};
                            this.remainingCards = context.target;
                            this.remainingStr = context.event.cards.length * 2;
                            this.game.queueSimpleStep(() =>
                                this.calculateNextCharacter(context.player)
                            );

                            this.game.queueSimpleStep(() => {
                                let strMessages = [];
                                for (let group in this.groups) {
                                    let strength = parseInt(group);
                                    let characters = this.groups[group];
                                    for (let character of characters) {
                                        this.untilEndOfPhase((ability) => ({
                                            match: character,
                                            effect: ability.effects.modifyStrength(strength)
                                        }));
                                    }
                                    // Groups chat messages by STR's given. eg. "give A, B and C +2 STR", or "give A +4 STR and B +2 STR"
                                    strMessages.push(
                                        Message.fragment('{characters} +{strength} STR', {
                                            characters,
                                            strength
                                        })
                                    );
                                }

                                this.game.addMessage(
                                    '{0} gives {1} until the end of the phase',
                                    context.player,
                                    strMessages
                                );

                                return true;
                            });
                        }
                    })),
                    context
                );
            }
        });
        this.action({
            title: 'Return character to hand',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('tyrell') &&
                    card.isUnique()
            },
            message: '{player} uses {source} to return a unique Tyrell character to their hand',
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    '{0} returns {1} to their hand',
                    this.controller,
                    context.target
                );
            }
        });
    }

    calculateNextCharacter(player) {
        let difference = this.remainingStr / 2 - this.remainingCards.length;
        if (this.remainingCards.length === 1 && this.remainingStr > 0) {
            // If one character remaining, give this character the remaining STR
            this.addCharacterToGroup(player, this.remainingStr);
        } else if (difference === 0) {
            // If STR can only be spread evenly, give this character +2 STR. This will be hit for remaining characters
            this.addCharacterToGroup(player, 2);
        } else {
            // Otherwise, ask how much STR to give this character
            let buttons = range(1, 2 + difference)
                .reverse()
                .map((amount) => {
                    let strength = amount * 2;
                    return {
                        text: strength.toString(),
                        method: 'addCharacterToGroup',
                        arg: strength
                    };
                });
            this.game.promptWithMenu(player, this, {
                activePrompt: {
                    menuTitle: `Select +STR for ${this.remainingCards[0].name}`,
                    buttons: buttons
                },
                source: this
            });
        }
        return true;
    }

    addCharacterToGroup(player, strength) {
        let characters = this.groups[strength] || [];
        characters.push(this.remainingCards.shift());
        this.groups[strength] = characters;

        this.remainingStr -= strength;

        if (this.remainingCards.length > 0) {
            this.calculateNextCharacter(player);
        }

        return true;
    }
}

Highgarden.code = '22023';

module.exports = Highgarden;
