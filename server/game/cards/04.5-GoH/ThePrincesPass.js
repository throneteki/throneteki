import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ThePrincesPass extends DrawCard {
    // The Prince's Pass (04096)
    // Reaction: After you lose a challenge as the defending player, kneel The Prince's Pass to
    // choose an attacking character. Until the end of the phase, that character loses a challenge
    // icon of your choice. Then, if it has no challenge icons, you may sacrifice The Prince's Pass
    // to discard it from play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.player &&
                    event.challenge.defendingPlayer === context.player
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking()
            },
            gameAction: GameActions.chooseIcon({
                message: '{player} kneels {source} to remove {icon} icon from {target}',
                gameAction: (icon) =>
                    GameActions.simultaneously([
                        GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.removeIcon(icon)
                        }))
                    ]).then((context) => ({
                        condition: () => context.target.getNumberOfIcons() === 0,
                        gameAction: GameActions.may({
                            title: `Sacrifice The Prince's Pass to discard ${context.target.name}?`,
                            gameAction: GameActions.sacrificeCard((context) => ({
                                card: context.source
                            })).then({
                                gameAction: GameActions.discardCard({ card: context.target })
                            })
                        })
                    }))
            })
        });
    }
}

ThePrincesPass.code = '04096';

export default ThePrincesPass;
