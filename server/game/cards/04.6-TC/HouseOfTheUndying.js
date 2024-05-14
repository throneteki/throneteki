import DrawCard from '../../drawcard.js';

class HouseOfTheUndying extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: "Take control of opponent's dead characters",
            phase: 'challenge',
            cost: ability.costs.removeSelfFromGame(),
            chooseOpponent: (opponent) => opponent.deadPile.length > 0,
            handler: (context) => this.controlDeadCharacters(context.player, context.opponent)
        });
    }

    controlDeadCharacters(currentController, opponent) {
        let eligibleCharacters = opponent.deadPile.filter((card) => {
            if (!card.isUnique()) {
                return true;
            }

            return opponent.deadPile.filter((c) => c.name === card.name).length === 1;
        });

        for (let card of eligibleCharacters) {
            currentController.putIntoPlay(card);
            this.atEndOfPhase((ability) => ({
                match: card,
                condition: () => ['play area', 'duplicate'].includes(card.location),
                targetLocation: 'any',
                effect: ability.effects.moveToDeadPileIfStillInPlay()
            }));
        }

        this.game.addMessage(
            '{0} removes {1} from the game to take control {2}',
            currentController,
            this,
            eligibleCharacters
        );
    }
}

HouseOfTheUndying.code = '04114';

export default HouseOfTheUndying;
