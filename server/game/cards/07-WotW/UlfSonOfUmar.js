import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class UlfSonOfUmar extends DrawCard {
    // Ulf Son of Umar (07029)
    // Reaction: After a Clansman character enters play under your control, Ulf Son of Umar gets +X
    // STR until the end of the phase. X is that character's printed STR. (Limit 3 times per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => {
                    let card = event.card;
                    if (
                        !card.hasTrait('Clansman') ||
                        card.getType() !== 'character' ||
                        card.controller !== context.source.controller ||
                        card.getPrintedStrength() === 0
                    ) {
                        return false;
                    }

                    context.source.strBoost = card.getPrintedStrength();
                    return true;
                }
            },
            limit: ability.limit.perPhase(3),
            message: {
                format: '{player} uses {source} to give {source} +{strBoost} STR until the end of the phase',
                args: { strBoost: (context) => context.source.strBoost }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source,
                effect: ability.effects.modifyStrength(context.source.strBoost)
            }))
        });
    }
}

UlfSonOfUmar.code = '07029';

export default UlfSonOfUmar;
