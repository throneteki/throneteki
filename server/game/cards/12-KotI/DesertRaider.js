import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DesertRaider extends DrawCard {
    // Desert Raider (12029)
    // Reaction: After you lose a challenge, put Desert Raider into play from your dead pile and
    // choose a character controlled by the winning opponent. That character gains 1 power. Until
    // the end of the phase, that character loses an [intrigue] or [power] icon and Desert Raider
    // gains that icon.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.loser === context.player
            },
            location: 'dead pile',
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.winner
            },
            message:
                '{player} puts {source} into play from their dead pile to have {target} gain 1 power',
            gameAction: GameActions.simultaneously([
                GameActions.putIntoPlay((context) => ({
                    player: context.player,
                    card: context.source
                })),
                GameActions.gainPower((context) => ({ card: context.target, amount: 1 })),
                GameActions.chooseIcon({
                    icons: ['intrigue', 'power'],
                    message:
                        '{player} chooses to have {target} lose {icon} icon and {source} gain it until the end of the phase',
                    gameAction: (icon) =>
                        GameActions.simultaneously([
                            GameActions.lastingEffect((context) => ({
                                duration: 'untilEndOfPhase',
                                match: context.target,
                                effect: ability.effects.removeIcon(icon)
                            })),
                            GameActions.lastingEffect((context) => ({
                                duration: 'untilEndOfPhase',
                                match: context.source,
                                effect: ability.effects.addIcon(icon)
                            }))
                        ])
                })
            ])
        });
    }
}

DesertRaider.code = '12029';

export default DesertRaider;
