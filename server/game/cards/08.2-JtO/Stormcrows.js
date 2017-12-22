const DrawCard = require('../../drawcard.js');

class Stormcrows extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character(s) -1 STR',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardXGold(() => 1, () => this.game.getNumberOfCardsInPlay(card => card.getType() === 'character')),
            handler: context => {
                let xValue = context.xValue;
                this.game.promptForSelect(this.controller, {
                    mode: 'exactly',
                    numCards: xValue,
                    activePromptTitle: 'Select ' + (xValue === 1 ? 'a' : xValue) + ' character' + (xValue === 1 ? '' : 's'),
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character',
                    onSelect: (player, cards) => this.targetsSelected(player, cards, xValue)
                });
            }
        });
    }

    targetsSelected(player, cards, xValue) {
        this.untilEndOfPhase(ability => ({
            match: card => cards.includes(card),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        }));

        this.game.addMessage('{0} discards {1} gold from {2} to give -1 STR to {3} until the end of the phase',
            player, xValue, this, cards);
        
        return true;
    }
}

Stormcrows.code = '08033';

module.exports = Stormcrows;
