import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BowelsOfCasterlyRock extends DrawCard {
    // Bowels of Casterly Rock (11030)
    // Reaction: After a card you control comes out of shadows, either: gain 2 gold, or draw 1 card.
    // (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card.controller === context.source.controller
            },
            limit: ability.limit.perPhase(1),
            choices: {
                'Gain 2 gold': {
                    message: '{player} uses {source} to gain 2 gold',
                    gameAction: GameActions.gainGold((context) => ({
                        player: context.player,
                        amount: 2
                    }))
                },
                'Draw 1 card': {
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                }
            }
        });
    }
}

BowelsOfCasterlyRock.code = '11030';

export default BowelsOfCasterlyRock;
