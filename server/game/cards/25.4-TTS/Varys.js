import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class Varys extends DrawCard {
    // Varys (25077)
    // Bestow (2). Stealth.
    // Action: Discard 1 gold from Varys to name a card. Until the end of the phase, that card
    // cannot be marshaled, played, or put into play. (Limit once per phase.)
    // Reaction: After a Scheme plot card is revealed, Varys gains 1 gold.
    setupCardAbilities(ability) {
        this.action({
            title: 'Name a card',
            cost: ability.costs.discardGold(),
            limit: ability.limit.perPhase(1),
            message: '{player} discards 1 gold from {source} to name a card',
            gameAction: GameActions.nameCard({
                message:
                    'Until the end of the phase, {cardName} cannot be marshaled, played or put into play',
                gameAction: GameActions.lastingEffect((context) => {
                    const named = (card) =>
                        card.name.toLowerCase() === context.namedCard.toLowerCase();
                    return {
                        duration: 'untilEndOfPhase',
                        targetController: 'any',
                        effect: [
                            ability.effects.cannotMarshal(named),
                            ability.effects.cannotPlay(named),
                            ability.effects.cannotPutIntoPlay(named)
                        ]
                    };
                })
            })
        });
        this.reaction({
            when: {
                onPlotRevealed: (event) => event.plot.hasTrait('Scheme')
            },
            message: '{player} uses {source} to place 1 gold on {source}',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.gold
            }))
        });
    }
}

Varys.code = '25077';

export default Varys;
