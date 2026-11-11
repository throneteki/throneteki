import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerGulianQorgyle extends DrawCard {
    // Ser Gulian Qorgyle (26047)
    // Reaction: After a character an opponent controls is declared as an attacker or defender, it
    // loses a challenge icon of your choice until the end of the phase. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) => event.card.controller !== context.player,
                onDeclaredAsDefender: (event, context) => event.card.controller !== context.player
            },
            limit: ability.limit.perPhase(2),
            gameAction: GameActions.chooseIcon({
                message: {
                    format: '{player} uses {source} to have {character} lose {icon} icon until the end of the phase',
                    args: { character: (context) => context.event.card }
                },
                gameAction: (icon) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.event.card,
                        effect: ability.effects.removeIcon(icon)
                    }))
            })
        });
    }
}

SerGulianQorgyle.code = '26047';

export default SerGulianQorgyle;
