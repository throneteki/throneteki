import DrawCard from '../../drawcard.js';

class BreakerOfChains extends DrawCard {
    // Breaker of Chains (06074)
    // Unique [targaryen] character only.
    // Attached character gets +1 STR for each character you control with printed cost 2 or lower.
    // Reaction: After attached character is declared as an attacker, put a character with printed
    // cost 2 or lower into play from your hand.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'targaryen', unique: true });

        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.getSTRBoost())
        });

        this.reaction({
            when: {
                onDeclaredAsAttacker: (event) => event.card === this.parent
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 2 &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play',
                    this.controller,
                    this,
                    context.target
                );
            }
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
