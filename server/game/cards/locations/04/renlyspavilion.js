const DrawCard = require('../../../drawcard.js');

class RenlysPavilion extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card to modify the strength of two characters',
            cost: ability.costs.kneelSelf(),
            method: 'kneel'
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character to get -1 STR',
            source: this,
            onSelect: (player, card) => this.firstCardSelected(player, card)
        });
        
        return true;
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area'; 
    }

    firstCardSelected(player, card) {
        this.minusCard = card;
        this.lowerStr(player, card);
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character to get +1 STR',
            source: this,
            onSelect: (player, card) => this.raiseStr(player, card)
        });
        return true;
    }

    lowerStr(player, card) {
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(-1)
        }));
        return true;
    }

    raiseStr(player, card) {
        this.plusCard = card;
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(1)
        }));

        this.game.addMessage('{0} kneels {1} to give {2} -1 STR and {3} +1 STR', player, this, this.minusCard, this.plusCard);

        return true;
    }
}

RenlysPavilion.code = '04104';

module.exports = RenlysPavilion;
