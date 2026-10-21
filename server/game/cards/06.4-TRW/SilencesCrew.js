import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class SilencesCrew extends DrawCard {
    // Silence's Crew (06071)
    // Bestow (3). No attachments. Pillage.
    // Silence's Crew gets +2 STR for each gold it has.
    // Reaction: After Silence's Crew discards a location or attachment using pillage, place 1 gold
    // from the treasury on Silence's Crew.
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
