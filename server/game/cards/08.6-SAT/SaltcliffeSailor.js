import DrawCard from '../../drawcard.js';
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
            condition: () => this.hasToken(Tokens.gold),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    !card.isFaction('greyjoy')
            },
            handler: (context) => {
                this.game.transferGold({ from: this, to: context.target, amount: 1 });
                this.game.addMessage(
                    '{0} moves 1 gold from {1} to {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

SaltcliffeSailor.code = '08111';

export default SaltcliffeSailor;
