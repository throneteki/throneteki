import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerDavosSeaworth extends DrawCard {
    // Ser Davos Seaworth (14006)
    // Stealth.
    // Reaction: After you win a challenge in which Ser Davos Seaworth is participating, discard 1
    // power from the losing opponent's faction card. Then, you may have a King character you
    // control gain 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.isParticipating() &&
                    event.challenge.winner === context.player &&
                    event.challenge.loser.faction.power > 0
            },
            message: {
                format: "{player} uses {source} to discard 1 power from {loser}'s faction card",
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.discardPower((context) => ({
                card: context.event.challenge.loser.faction
            })).then({
                target: {
                    cardCondition: (card, context) =>
                        card.location === 'play area' &&
                        card.controller === context.player &&
                        card.getType() === 'character' &&
                        card.hasTrait('King')
                },
                message: 'Then {player} uses {source} to have {target} gain 1 power',
                gameAction: GameActions.gainPower((context) => ({
                    card: context.target,
                    amount: 1
                }))
            })
        });
    }
}

SerDavosSeaworth.code = '14006';

export default SerDavosSeaworth;
