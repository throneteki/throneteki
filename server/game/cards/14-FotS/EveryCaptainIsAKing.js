import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class EveryCaptainIsAKing extends DrawCard {
    // Every Captain is a King (14026)
    // Action: Until the end of the phase, each Captain character you control gains the King trait
    // and does not kneel when declared as an attacker in [power] challenges.
    setupCardAbilities(ability) {
        this.action({
            title: 'Grant King trait',
            condition: (context) =>
                context.source.getCaptains(context.source.controller).length > 0,
            message: {
                format: '{player} plays {source} to have {captains} gain the King trait',
                args: { captains: (context) => context.source.getCaptains(context.player) }
            },
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.source.getCaptains(context.player),
                    effect: ability.effects.addTrait('King')
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.source.getCaptains(context.player),
                    effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'power' })
                }))
            ])
        });
    }

    getCaptains(player) {
        return player.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Captain')
        );
    }
}

EveryCaptainIsAKing.code = '14026';

export default EveryCaptainIsAKing;
