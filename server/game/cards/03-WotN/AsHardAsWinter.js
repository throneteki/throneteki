import DrawCard from '../../drawcard.js';

class AsHardAsWinter extends DrawCard {
    // As Hard as Winter (03022)
    // Play only if there is a Winter plot card in your used pile.
    // Reaction: After a [stark] character you control is sacrificed or killed, put a [stark]
    // character with equal or lower printed cost into play from your hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onSacrificed: (event) =>
                    this.hasUsedWinterPlot() &&
                    this.starkCharacterSacrificedOrKilled(event.cardStateWhenSacrificed),
                onCharacterKilled: (event) =>
                    this.hasUsedWinterPlot() &&
                    this.starkCharacterSacrificedOrKilled(event.cardStateWhenKilled)
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    card.isFaction('stark') &&
                    card.getPrintedCost() <= context.event.card.getPrintedCost() &&
                    this.controller.canPutIntoPlay(card)
            },

            handler: (context) => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} uses {1} to put into play {2} for free in reaction to a {3} character being sacrificed or killed',
                    this.controller,
                    this,
                    context.target,
                    'stark'
                );
            }
        });
    }

    hasUsedWinterPlot() {
        return this.game.allCards.some(
            (card) =>
                card.controller === this.controller &&
                card.location === 'revealed plots' &&
                card.hasTrait('Winter')
        );
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

export default AsHardAsWinter;
