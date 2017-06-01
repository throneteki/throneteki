const DrawCard = require('../../../drawcard.js');

class BlackBetha extends DrawCard {
    //Just used Iron Fleet Scout as template.  Overly verbose, but easy to understand.  Could be refactored into something more concise (a la The Valyrian).

    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Ser Davos Seaworth',
            effect: ability.effects.addKeyword('renown')
        });
        this.action({
            title: 'Kneel to give attacking character +X STR',
            cost: ability.costs.kneelSelf(),
            condition: () => this.game.currentChallenge && this.game.currentChallenge.attackers.length >= 1,
            method: 'kneel'
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.returnCondition(card),
            activePromptTitle: 'Select character to gain STR',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    returnCondition(card) {
        return card.getType() === 'character' && card.location === 'play area' && this.game.currentChallenge.isAttacking(card);
    }

    onCardSelected(player, card) {
        var strength = this.calculateStrength();
        this.game.addMessage('{0} kneels {1} to give {2} +{3} STR until the end of the challenge', player, this, card, strength);
        this.untilEndOfChallenge(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(strength)
        }));

        return true;
    }

    // Just used same strength calculation as Robert Baratheon - with a flag to ignore cards owned by attacker.
    calculateStrength() {
        return this.game.allCards.reduce((counter, card) => {
            if(card === this || card.owner === this.game.currentChallenge.attackingPlayer || card.location !== 'play area' || card.getType() !== 'character' || !card.kneeled) {
                return counter;
            }

            return counter +1;
        }, 0);
    }
}

BlackBetha.code = '07026';

module.exports = BlackBetha;
