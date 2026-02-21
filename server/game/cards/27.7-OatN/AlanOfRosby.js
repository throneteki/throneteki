import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AlanOfRosby extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this && this.game.isDuringChallenge()
            },
            target: {
                cardCondition: {
                    type: 'character',
                    defending: true,
                    controller: 'current',
                    faction: 'thenightswatch'
                }
            },
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

AlanOfRosby.code = '27551';
AlanOfRosby.version = '1.0.0';

export default AlanOfRosby;
