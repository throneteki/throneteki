import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BrienneOfTarth extends DrawCard {
    // Brienne of Tarth (09002)
    // Reaction: After you win a challenge in which Brienne of Tarth is participating, if her STR
    // is:
    // - 6 or higher, she gains 1 power.
    // - 10 or higher, choose another character. It gets +3 STR until the end of the phase.
    // - 15 or higher, stand her and draw 1 card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player && context.source.isParticipating()
            },
            gameAction: GameActions.simultaneously([
                GameActions.ifCondition({
                    condition: (context) => context.source.getStrength() >= 6,
                    thenAction: {
                        message: '{player} uses {source} to have {source} gain 1 power',
                        gameAction: GameActions.gainPower((context) => ({
                            card: context.source,
                            amount: 1
                        }))
                    }
                }),
                GameActions.ifCondition({
                    condition: (context) => context.source.getStrength() >= 10,
                    thenAction: {
                        message:
                            '{player} uses {source} to give another character +3 STR until the end of the phase',
                        gameAction: GameActions.chooseCards({
                            title: 'Select a character',
                            cardCondition: (card, context) =>
                                card !== context.source &&
                                card.location === 'play area' &&
                                card.getType() === 'character',
                            gameAction: (card) =>
                                GameActions.lastingEffect(() => ({
                                    duration: 'untilEndOfPhase',
                                    match: card,
                                    effect: ability.effects.modifyStrength(3)
                                }))
                        })
                    }
                }),
                GameActions.ifCondition({
                    condition: (context) => context.source.getStrength() >= 15,
                    thenAction: {
                        message: '{player} uses {source} to stand {source} and draw 1 card',
                        gameAction: GameActions.simultaneously([
                            GameActions.standCard((context) => ({ card: context.source })),
                            GameActions.drawCards((context) => ({
                                player: context.player,
                                amount: 1
                            }))
                        ])
                    }
                })
            ])
        });
    }
}

BrienneOfTarth.code = '09002';

export default BrienneOfTarth;
