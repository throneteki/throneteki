import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NymeriaSand extends DrawCard {
    // Nymeria Sand (02035)
    // Challenges Action: Choose an opponent's character. Until the end of the phase, that character
    // loses a challenge icon of your choice, and each Sand Snake character you control gains that
    // challenge icon. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove and gain icon',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller !== context.source.controller &&
                    card.getType() === 'character'
            },
            gameAction: GameActions.chooseIcon({
                message:
                    '{player} uses {source} to remove {icon} icon from {target} and have each Sand Snake character they control gain it',
                gameAction: (icon) =>
                    GameActions.simultaneously([
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.removeIcon(icon)
                        })),
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.player.filterCardsInPlay(
                                (card) =>
                                    card.getType() === 'character' && card.hasTrait('Sand Snake')
                            ),
                            effect: ability.effects.addIcon(icon)
                        }))
                    ])
            })
        });
    }
}

NymeriaSand.code = '02035';

export default NymeriaSand;
