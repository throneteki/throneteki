const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');

class CasterlyRock extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: card => card.controller === this.controller && card.location === 'play area' && card.isFaction('lannister'),
            effect: ability.effects.canSpendGold(spendParams => spendParams.activePlayer === this.controller)
        });
        this.action({
            title: 'Select cards to gain gold',
            cost: ability.costs.kneelSelf(),
            phase: 'marshal',
            handler: context => {
                this.game.promptForSelect(context.player, {
                    multiSelect: true,
                    numCards: 3,
                    activePromptTitle: 'Select 3 cards',
                    source: this,
                    cardCondition: card => card.location === 'play area',
                    onSelect: (player, cards) => this.onSelect(player, cards),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onSelect(player, cards) {
        for(let card of cards) {
            card.modifyToken(Tokens.gold, 1);
        }

        this.game.addMessage('{0} kneels {1} to move 1 gold from the treasury to {2}',
            player, this, cards);
        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
    }
}

CasterlyRock.code = '22008';

module.exports = CasterlyRock;
