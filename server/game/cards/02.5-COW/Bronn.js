import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Bronn extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of Bronn',
            phase: 'marshal',
            anyPlayer: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to take control of {source}',
            gameAction: GameActions.takeControl((context) => ({
                player: context.player,
                card: this
            }))
        });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ defendingPlayer: this.controller }),
            match: this,
            effect: [
                ability.effects.addIcon('military'),
                ability.effects.addIcon('intrigue'),
                ability.effects.addIcon('power')
            ]
        });
    }
}

Bronn.code = '02089';

export default Bronn;
