import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class StannissCavalry extends DrawCard {
    // Stannis's Cavalry (06087)
    // Bestow (8). No attachments.
    // Each character an opponent controls with printed cost X cannot stand during the standing
    // phase. X is the number of gold Stannis's Cavalry has.
    // Standing Action: Move 1 gold from your gold pool to Stannis's Cavalry. (Limit twice per
    // phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.currentPhase === 'standing',
            targetController: 'opponent',
            match: (card, context) =>
                card.getType() === 'character' &&
                card.getPrintedCost() === context.source.tokens[Tokens.gold],
            effect: ability.effects.cannotBeStood()
        });
        this.action({
            title: "Move gold to Stannis's Cavalry",
            phase: 'standing',
            limit: ability.limit.perPhase(2),
            message: '{player} moves 1 gold from their gold pool to {source}',
            gameAction: GameActions.transferGold((context) => ({
                from: context.player,
                to: context.source,
                amount: 1
            }))
        });
    }
}

StannissCavalry.code = '06087';

export default StannissCavalry;
