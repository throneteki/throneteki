import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

const eligibleCharacters = (opponent) =>
    opponent.deadPile.filter(
        (card) =>
            card.getType() === 'character' &&
            (!card.isUnique() ||
                opponent.deadPile.filter((other) => other.name === card.name).length === 1)
    );

class HouseOfTheUndying extends DrawCard {
    // House of the Undying (04114)
    // Challenges Action: Remove House of the Undying from the game to choose an opponent. Put each
    // character in that player's dead pile into play under your control. At the end of the phase,
    // return each of those cards to its owner's dead pile (cannot be saved).
    setupCardAbilities(ability) {
        this.action({
            title: "Take control of opponent's dead characters",
            phase: 'challenge',
            cost: ability.costs.removeSelfFromGame(),
            chooseOpponent: (opponent) => eligibleCharacters(opponent).length > 0,
            message:
                "{player} removes {source} from the game to put each character in {opponent}'s dead pile into play under their control",
            gameAction: GameActions.simultaneously((context) =>
                eligibleCharacters(context.opponent).flatMap((card) => [
                    GameActions.putIntoPlay({ player: context.player, card }),
                    GameActions.lastingEffect(() => ({
                        duration: 'atEndOfPhase',
                        match: card,
                        condition: () => ['play area', 'duplicate'].includes(card.location),
                        targetLocation: 'any',
                        effect: ability.effects.moveToDeadPileIfStillInPlay()
                    }))
                ])
            )
        });
    }
}

HouseOfTheUndying.code = '04114';

export default HouseOfTheUndying;
