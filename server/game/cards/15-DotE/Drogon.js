import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Drogon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('Stormborn'),
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            message: {
                format: '{player} uses {source} to kill each character {defendingPlayer} controls with STR 1 or lower',
                args: { defendingPlayer: (context) => context.event.challenge.defendingPlayer }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.event.challenge.defendingPlayer
                    .filterCardsInPlay(
                        (card) => card.getType() === 'character' && card.getStrength() <= 1
                    )
                    .map((card) => GameActions.kill({ card }))
            )
        });
    }
}

Drogon.code = '15002';

export default Drogon;
