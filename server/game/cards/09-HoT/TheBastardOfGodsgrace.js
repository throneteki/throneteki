import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheBastardOfGodsgrace extends DrawCard {
    // The Bastard of Godsgrace (09031)
    // Renown.
    // Challenges Action: Discard 1 power from The Bastard of Godsgrace to reduce the cost of the
    // next card you play or ambush this phase by 2.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce play / ambush cost by 2',
            phase: 'challenge',
            cost: ability.costs.discardPowerFromSelf(),
            message:
                '{player} discards a power from {source} to reduce the cost of the next card played or ambushed this phase by 2',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                effect: ability.effects.reduceNextAmbushedOrPlayedCardCost(2)
            }))
        });
    }
}

TheBastardOfGodsgrace.code = '09031';

export default TheBastardOfGodsgrace;
