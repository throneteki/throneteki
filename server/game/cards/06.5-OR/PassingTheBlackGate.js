import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class PassingTheBlackGate extends DrawCard {
    // Passing the Black Gate (06082)
    // Marshaling Action: Kneel your faction card to reduce the cost of each [stark] character you
    // marshal this phase by 1.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce Stark characters',
            phase: 'marshal',
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} plays {source} and kneels their faction card to reduce the cost of each stark character they marshal this phase by 1',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                effect: ability.effects.reduceCost({
                    playingTypes: 'marshal',
                    amount: 1,
                    match: (card) => card.isFaction('stark') && card.getType() === 'character'
                })
            }))
        });
    }
}

PassingTheBlackGate.code = '06082';

export default PassingTheBlackGate;
