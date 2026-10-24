import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GateOfTheGods extends DrawCard {
    // Gate of the Gods (13004)
    // Limited.
    // Challenges Action: If you control a character with the highest STR in play, sacrifice Gate of
    // the Gods to draw 2 cards.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => context.source.characterWithHighestStrength(context.player),
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
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
