import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SaltcliffeSailor extends DrawCard {
    // Saltcliffe Sailor (08111)
    // Bestow (3).
    // Each character you control with 1 or more gold gains stealth.
    // Action: Move 1 gold from Saltcliffe Sailor to a non-[greyjoy] character you control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasToken(Tokens.gold),
            effect: ability.effects.addKeyword('Stealth')
        });
        this.action({
            title: 'Move 1 gold to character',
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.player &&
                    !card.isFaction('greyjoy')
            },
            message: '{player} moves 1 gold from {source} to {target}',
            gameAction: GameActions.transferGold((context) => ({
                from: context.source,
                to: context.target,
                amount: 1
            }))
        });
    }
}

SaltcliffeSailor.code = '08111';

export default SaltcliffeSailor;
