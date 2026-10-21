import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class RedCloaks extends DrawCard {
    // Red Cloaks (02070)
    // During [intrigue] challenges, Red Cloaks gets +1 STR for each gold on it.
    // Action: Move 1 gold from your gold pool to Red Cloaks. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Move 1 gold from your gold pool to this card',
            limit: ability.limit.perPhase(1),
            condition: () => this.controller.getSpendableGold() >= 1,
            handler: () => {
                this.game.transferGold({ from: this.controller, to: this, amount: 1 });
                this.game.addMessage(
                    '{0} moves 1 gold from their gold pool to {1}',
                    this.controller,
                    this
                );
            }
        });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'intrigue' }),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold])
        });
    }
}

RedCloaks.code = '02070';

export default RedCloaks;
