import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DornishSpy extends DrawCard {
    // Dornish Spy (06115)
    // Ambush (4).
    // Reaction: After Dornish Spy enters play, choose a character. Until the end of the phase, that
    // character loses a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
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
            })
        });
    }
}

DornishSpy.code = '06115';

export default DornishSpy;
