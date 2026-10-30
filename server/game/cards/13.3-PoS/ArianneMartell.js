import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ArianneMartell extends DrawCard {
    // Arianne Martell (13055)
    // Shadow (5). Stealth.
    // Reaction: After a card comes out of shadows under your control, choose a character. Until the
    // end of the phase, that character loses a challenge icon of your choice. (Limit 3 times per
    // round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card.controller === context.source.controller
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            gameAction: GameActions.chooseIcon({
                message: '{player} uses {source} to remove {icon} icon from {target}',
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }))
            }),
            limit: ability.limit.perRound(3)
        });
    }
}

ArianneMartell.code = '13055';

export default ArianneMartell;
