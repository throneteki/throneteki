import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DoranMartell extends DrawCard {
    // Doran Martell (10001)
    // Action: Kneel your faction card to choose a participating character with fewer than 2
    // challenge icons and remove it from the challenge.
    // Reaction: After you lose a challenge, choose a character. Until the end of the phase, that
    // character gains or loses a challenge icon of your choice.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from challenge',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isParticipating() &&
                    card.getNumberOfIcons() < 2
            },
            message:
                '{player} uses {source} and kneels their faction card to remove {target} from the challenge',
            gameAction: GameActions.removeFromChallenge((context) => ({ card: context.target }))
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.loser === context.player
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            gameAction: GameActions.choose({
                title: (context) => `Choose for ${context.target.name}?`,
                choices: {
                    'Gain Icon': changeIcon('gain', (icon) => ability.effects.addIcon(icon)),
                    'Lose Icon': changeIcon('lose', (icon) => ability.effects.removeIcon(icon))
                }
            })
        });
    }
}

function changeIcon(verb, effect) {
    return GameActions.chooseIcon({
        message: {
            format: '{player} uses {source} to have {target} {verb} {icon} icon until the end of the phase',
            args: { verb: () => verb }
        },
        gameAction: (icon) =>
            GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: effect(icon)
            }))
    });
}

DoranMartell.code = '10001';

export default DoranMartell;
