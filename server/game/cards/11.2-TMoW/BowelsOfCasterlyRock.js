import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BowelsOfCasterlyRock extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
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
