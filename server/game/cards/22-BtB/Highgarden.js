const DrawCard = require('../../drawcard.js');

class Highgarden extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return character to hand',
            phase: 'challenge',
            cost: ability.costs.returnToHand(card => card.getType() === 'character' && card.isFaction('tyrell') && card.isUnique()),
            handler: context => {
                this.game.addMessage('{0} uses {1} and returns {2} to their hand to reveal the top card of each players deck', this.controller, this, context.costs.returnToHand);
                for(let player of this.game.getPlayers()) {
                    let topCard = player.drawDeck[0];
                    this.game.addMessage('{0} reveals {1} as the top card of {2}\'s deck', this.controller, topCard, player);
                }
            }
        });
        this.action({
            title: 'Give characters STR',
            phase: 'challenge',
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
    }

    revealSelect(player, cards) {
        this.game.addMessage('{0} kneels {1} to reveal {2} from their hand', player, this, cards);

        for(let index in cards) {
            this.game.promptForSelect(this.controller, {
                activePromptTitle: `Select a character for +2 STR (${index + 1}/${cards.length})`,
                source: this,
                cardCondition: card => card.getType() === 'character' && card.location === 'play area',
                onSelect: (player, card) => this.characterSelect(player, card),
                onCancel: (player) => this.characterCancel(player)
            });
        }
        return true;
    }

    revealCancel(player) {
        this.game.addAlert('danger', '{0} did not reveal any cards for {1}', player, this);

        return true;
    }

    characterSelect(player, card) {
        this.game.addMessage('{0} then uses {1} to give {2} +2 STR until the end of the phase', player, this, card);

        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(2)
        }));

        return true;
    }

    characterCancel(player) {
        this.game.addAlert('danger', '{0} did not select a character for {1}', player, this);

        return true;
    }
}

Highgarden.code = '22023';

module.exports = Highgarden;
