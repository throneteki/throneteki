import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ObsidianArrows extends DrawCard {
    // Obsidian Arrows (08066)
    // Bestow (4).
    // Action: While attached character is attacking, move 1 gold from Obsidian Arrows to a
    // defending character to give that character –3 STR until the end of the challenge. (Limit once
    // per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Give defending character -3 STR',
            limit: ability.limit.perChallenge(1),
            condition: (context) => context.source.parent && context.source.parent.isAttacking(),
            cost: ability.costs.moveTokenFromSelf(
                'gold',
                1,
                (card) => card.isDefending() && card.allowGameAction('decreaseStrength')
            ),
            message:
                '{player} moves 1 gold from {source} to {costs.moveTokenFromSelf} to give {costs.moveTokenFromSelf} -3 STR until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.costs.moveTokenFromSelf,
                effect: ability.effects.modifyStrength(-3)
            }))
        });
    }
}

ObsidianArrows.code = '08066';

export default ObsidianArrows;
