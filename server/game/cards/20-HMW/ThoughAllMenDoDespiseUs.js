import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ThoughAllMenDoDespiseUs extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                onDefendersDeclared: (event) =>
                    event.player !== this.controller &&
                    event.numOfDefendingCharacters === 0 &&
                    this.hasAttackingRaider()
            },
            message: '{player} uses {source} to have each attacking Raider character gain 1 power',
            gameAction: GameActions.simultaneously((context) =>
                context.player
                    .filterCardsInPlay(
                        (card) =>
                            card.isAttacking() &&
                            card.hasTrait('Raider') &&
                            card.getType() === 'character'
                    )
                    .map((card) => GameActions.gainPower({ card: card, amount: 1 }))
            )
        });
    }

    hasAttackingRaider() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isAttacking() && card.hasTrait('Raider') && card.getType() === 'character'
        );
    }
}

ThoughAllMenDoDespiseUs.code = '20009';

export default ThoughAllMenDoDespiseUs;
