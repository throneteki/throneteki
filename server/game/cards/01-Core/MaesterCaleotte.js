import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class MaesterCaleotte extends DrawCard {
    // Maester Caleotte (01107)
    // Reaction: After you lose a challenge in which Maester Caleotte is participating, choose a
    // character. That character loses a challenge icon of your choice until the end of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    context.source.isParticipating()
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

MaesterCaleotte.code = '01107';

export default MaesterCaleotte;
