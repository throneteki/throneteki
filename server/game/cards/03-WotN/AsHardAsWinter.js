import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AsHardAsWinter extends DrawCard {
    // As Hard as Winter (03022)
    // Play only if there is a Winter plot card in your used pile.
    // Reaction: After a [stark] character you control is sacrificed or killed, put a [stark]
    // character with equal or lower printed cost into play from your hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                onSacrificed: (event, context) =>
                    hasUsedWinterPlot(context.player) &&
                    isOwnStarkCharacter(event.cardStateWhenSacrificed, context.player),
                onCharacterKilled: (event, context) =>
                    hasUsedWinterPlot(context.player) &&
                    isOwnStarkCharacter(event.cardStateWhenKilled, context.player)
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    card.isFaction('stark') &&
                    card.getPrintedCost() <= context.event.card.getPrintedCost()
            },
            message: '{player} plays {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({ card: context.target }))
        });
    }
}

function hasUsedWinterPlot(player) {
    return player.plotDiscard.some((card) => card.hasTrait('Winter'));
}

function isOwnStarkCharacter(card, player) {
    return card.controller === player && card.isFaction('stark') && card.getType() === 'character';
}

AsHardAsWinter.code = '03022';

export default AsHardAsWinter;
