import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class GateOfTheGods extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => this.characterWithHighestStrength(context.player),
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                let cards = context.player.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} sacrifices {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }

    characterWithHighestStrength(player) {
        let charactersInPlay = this.game.filterCardsInPlay(
            (card) => card.getType() === 'character'
        );
        let strengths = charactersInPlay.map((card) => card.getStrength());
        let highestStrength = Math.max(...strengths);

        return player.anyCardsInPlay(
            (card) => card.getType() === 'character' && card.getStrength() >= highestStrength
        );
    }
}

GateOfTheGods.code = '13004';

export default GateOfTheGods;
