import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DriftwoodCudgel extends DrawCard {
    // Driftwood Cudgel (08112)
    // Drowned God character only.
    // Attached character gets +1 STR for each character in your dead pile.
    // Interrupt: When attached character is killed, move Driftwood Cudgel to another eligible
    // character. That character gains 1 power. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Drowned God' });

        this.whileAttached({
            effect: ability.effects.dynamicStrength(
                (card, context) => context.source.controller.deadPile.length
            )
        });

        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source.parent
            },
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card !== context.source.parent
            },
            message:
                '{player} uses {source} to attach {source} to {target} and have it gain 1 power',
            gameAction: GameActions.simultaneously([
                GameActions.attach((context) => ({
                    attachment: context.source,
                    target: context.target
                })),
                GameActions.gainPower((context) => ({ card: context.target, amount: 1 }))
            ]),
            limit: ability.limit.perPhase(1)
        });
    }
}

DriftwoodCudgel.code = '08112';

export default DriftwoodCudgel;
