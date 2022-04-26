const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const Message = require('../../Message');
const range = require('lodash.range');

class Highgarden extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give characters +STR',
            condition: () => this.controller.hand.length > 0,
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Reveal up to 3 cards',
                    source: this,
                    numCards: 3,
                    mode: 'upTo',
                    cardCondition: card => card.controller === this.controller && card.location === 'hand' && card.isFaction('tyrell') && card.getType() === 'character',
                    onSelect: (player, cards) => this.revealSelect(player, cards),
                    onCancel: (player) => this.revealCancel(player)
                });
            }
        });
        this.action({
            title: 'Return character to hand',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: card => card.location === 'play area' && card.controller === this.controller && 
                    card.getType() === 'character' && card.isFaction('tyrell') && card.isUnique()
            },
            handler: context => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage('{0} uses {1} to return {2} to their hand', this.controller, this, context.target);
            }
        });
    }

    revealSelect(player, revealed) {
        this.game.addMessage('{0} kneels {1} to reveal {2} from their hand', player, this, revealed);

        this.game.resolveGameAction(GameActions.simultaneously(
            revealed.map(card => GameActions.revealCard({ card }))
        ));

        let numRevealed = revealed.length;

        this.game.promptForSelect(this.controller, {
            activePromptTitle: `Select up to ${numRevealed} characters`,
            source: this,
            numCards: numRevealed,
            mode: 'upTo',
            cardCondition: card => card.getType() === 'character' && card.location === 'play area',
            onSelect: (player, cards) => this.charactersSelect(player, cards, numRevealed),
            onCancel: (player) => this.charactersCancel(player)
        });
        return true;
    }

    revealCancel(player) {
        this.game.addAlert('danger', '{0} did not reveal any cards for {1}', player, this);

        return true;
    }

    charactersSelect(player, cards, numRevealed) {
        this.strCharacterMap = new Map();
        this.remainingCards = cards;
        this.remainingStr = numRevealed * 2;
        
        this.game.queueSimpleStep(() => this.calculateNextCharacter(player));
        
        this.game.queueSimpleStep(() => {
            for(let [str, cards] of this.strCharacterMap) {
                for(let card of cards) {
                    this.untilEndOfPhase(ability => ({
                        match: card,
                        effect: ability.effects.modifyStrength(str)
                    }));
                }
            }
            // Groups chat messages by STR's given. eg. "give A, B and C +2 STR", or "give A +4 STR and B +2 STR"
            let strMessages = Array.from(this.strCharacterMap, ([str, cards]) => Message.fragment('{cards} +{str} STR', { cards, str }));

            this.game.addMessage('{0} then uses {1} to give {2} until the end of the phase', player, this, strMessages);

            return true;
        });
        return true;
    }

    calculateNextCharacter(player) {
        let difference = (this.remainingStr / 2) - this.remainingCards.length;
        if(this.remainingCards.length === 1 && this.remainingStr > 0) {
            // If one character remaining, give this character the remaining STR
            this.addCharacterToStrMap(player, this.remainingStr);
        } else if(difference === 0) {
            // If STR can only be spread evenly, give this character +2 STR. This will be hit for remaining characters
            this.addCharacterToStrMap(player, 2);
        } else {
            // Otherwise, ask how much STR to give this character
            let buttons = range(1, 2 + difference).reverse().map(amount => {
                let str = amount * 2;
                return { text: str.toString(), method: 'addCharacterToStrMap', arg: str };
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

    addCharacterToStrMap(player, str) {
        let characters = this.strCharacterMap.get(str) || [];
        characters.push(this.remainingCards.shift());
        this.strCharacterMap.set(str, characters);

        this.remainingStr -= str;

        if(this.remainingCards.length > 0) {
            this.calculateNextCharacter(player);
        }

        return true;
    }

    charactersCancel(player) {
        this.game.addAlert('danger', '{0} did not select any characters for {1}', player, this);

        return true;
    }
}

Highgarden.code = '22023';

module.exports = Highgarden;
