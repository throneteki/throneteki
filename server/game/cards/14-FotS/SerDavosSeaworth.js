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
                afterChallenge: (event) =>
                    this.isParticipating() &&
                    event.challenge.winner === this.controller &&
                    event.challenge.loser.faction.power > 0
            },
            message: {
                format: "{player} uses {source} to discard 1 power from {loser}'s faction card",
                args: { loser: (context) => context.event.challenge.loser }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.discardPower((context) => ({
                        card: context.event.challenge.loser.faction
                    })).then({
                        target: {
                            cardCondition: (card) =>
                                card.location === 'play area' &&
                                card.controller === context.player &&
                                card.getType() === 'character' &&
                                card.hasTrait('King') &&
                                card.canGainPower()
                        },
                        message: 'Then {player} uses {source} to have {target} gain 1 power',
                        handler: (thenContext) => {
                            this.game.resolveGameAction(
                                GameActions.gainPower((thenContext) => ({
                                    card: thenContext.target,
                                    amount: 1
                                })),
                                thenContext
                            );
                        }
                    }),
                    context
                );
            }
        });
    }
}

SerDavosSeaworth.code = '14006';

export default SerDavosSeaworth;
