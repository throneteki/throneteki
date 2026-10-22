import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BreakerOfChains extends DrawCard {
    // Breaker of Chains (06074)
    // Unique [targaryen] character only.
    // Attached character gets +1 STR for each character you control with printed cost 2 or lower.
    // Reaction: After attached character is declared as an attacker, put a character with printed
    // cost 2 or lower into play from your hand.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen', unique: true });

        this.whileAttached({
            effect: ability.effects.dynamicStrength((card, context) => context.source.getSTRBoost())
        });

        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) => event.card === context.source.parent
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 2 &&
                    context.source.controller.canPutIntoPlay(card)
            },
            message: '{player} uses {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }

    getSTRBoost() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.getPrintedCost() <= 2
        );
    }
}

BreakerOfChains.code = '06074';

export default BreakerOfChains;
