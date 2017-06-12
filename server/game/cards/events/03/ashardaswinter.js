const DrawCard = require('../../../drawcard.js');

class AsHardAsWinter extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onSacrificed: (event, player, card) => this.checkConditionsAndSaveCharacter(card),
                onCharacterKilled: (event) => this.checkConditionsAndSaveCharacter(event.card)
            },

            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => (
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    card.isFaction('stark') && 
                    card.getCost() <= this.triggerCard.getCost()
                )
            },

            handler: context => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage('{0} uses {1} to put into play {2} for free in reaction to a {3} character being sacrificed or killed', this.controller, this, context.target, 'stark');
            }
        });
    }

    checkConditionsAndSaveCharacter(card) {
        if(this.hasUsedWinterPlot() && this.starkCharacterSacrificedOrKilled(card)) {
            this.triggerCard = card;

            return true;
        }

        return false;
    }

    hasUsedWinterPlot() {
        return this.controller.allCards.any(card => (
            card.controller === this.controller &&
            card.location === 'revealed plots' &&
            card.hasTrait('Winter')
        ));
    }

    starkCharacterSacrificedOrKilled(card) {
        return (
            this.controller === card.controller &&
            card.isFaction('stark') &&
            card.getType() === 'character'
        );
    }
}

AsHardAsWinter.code = '03022';

module.exports = AsHardAsWinter;
