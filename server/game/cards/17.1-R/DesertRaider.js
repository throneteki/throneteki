import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DesertRaider extends DrawCard {
    // Desert Raider (17112)
    // Prized 1.
    // Reaction: After you lose a challenge, put Desert Raider into play from your dead pile to
    // choose a character controlled by the winning opponent. Until the end of the phase, that
    // character loses an [intrigue] or [power] icon and Desert Raider gains that icon.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.loser === context.player
            },
            location: 'dead pile',
            cost: ability.costs.putSelfIntoPlay(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.event.challenge.winner
            },
            gameAction: GameActions.chooseIcon({
                icons: ['intrigue', 'power'],
                message:
                    '{player} puts {source} into play from their dead pile to have {target} lose {icon} icon and have {source} gain {icon} icon until the end of the phase',
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
        });
    }
}

DesertRaider.code = '17112';

export default DesertRaider;
