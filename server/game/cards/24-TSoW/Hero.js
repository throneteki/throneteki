import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Hero extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    this.controller.getHandCount() < event.challenge.loser.getHandCount()
            },
            target: {
                cardCondition: {
                    or: [
                        { type: 'character', trait: 'Army', location: 'play area' },
                        { name: 'Grey Worm', location: 'play area' }
                    ]
                }
            },
            limit: ability.limit.perPhase(2),
            message: '{player} uses {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

Hero.code = '24019';

export default Hero;
