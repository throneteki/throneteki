import DrawCard from '../../drawcard.js';
import Conditions from '../../Conditions.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class OldGate extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => Conditions.allCharactersAreStark({ player: context.player }),
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 2
            })).thenExecute((event) => {
                this.game.addMessage(
                    '{0} sacrifices {1} to draw {2}',
                    event.player,
                    this,
                    TextHelper.count(event.cards.length, 'card')
                );
            })
        });
    }
}

OldGate.code = '13002';

export default OldGate;
