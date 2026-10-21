import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class VenomousBlade extends DrawCard {
    // Venomous Blade (04036)
    // [martell] character you control only. Ambush (3).
    // Attached character gets +1 STR.
    // Reaction: After Venomous Blade enters play, place a poison token on a character with printed
    // STR 2 or lower. At the end of the phase, if that character still has that poison token,
    // remove it and kill that character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'martell', controller: 'current' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedStrength() <= 2
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'atEndOfPhase',
                match: context.target,
                effect: ability.effects.poison
            }))
        });
    }
}

VenomousBlade.code = '04036';

export default VenomousBlade;
