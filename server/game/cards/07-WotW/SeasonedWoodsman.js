import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SeasonedWoodsman extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event) =>
                    event.attachment.controller === this.controller &&
                    event.target === this &&
                    (this.controller.canGainGold() || this.controller.canDraw())
            },
            limit: ability.limit.perPhase(2),
            choices: {
                'Gain 1 gold': {
                    message: '{player} uses {source} to gain 1 gold',
                    gameAction: GameActions.gainGold((context) => ({
                        player: context.player,
                        amount: 1
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

SeasonedWoodsman.code = '07015';

export default SeasonedWoodsman;
