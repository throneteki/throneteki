import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SilencesCrew extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens[Tokens.gold] * 2)
        });

        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.isPillage &&
                    event.source === this &&
                    (event.card.getType() === 'location' || event.card.getType() === 'attachment')
            },
            handler: () => {
                this.modifyToken(Tokens.gold, 1);
                this.game.addMessage(
                    '{0} moves 1 gold token from the treasury to {1}',
                    this.controller,
                    this
                );
            }
        });
    }
}

SilencesCrew.code = '06071';

export default SilencesCrew;
