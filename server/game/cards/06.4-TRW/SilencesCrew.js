import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
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
            effect: ability.effects.dynamicStrength(
                (card, context) => context.source.tokens[Tokens.gold] * 2
            )
        });

        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source === context.source &&
                    (event.card.getType() === 'location' || event.card.getType() === 'attachment')
            },
            message: '{player} moves 1 gold token from the treasury to {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.gold,
                amount: 1
            }))
        });
    }
}

SilencesCrew.code = '06071';

export default SilencesCrew;
