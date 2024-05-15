import DrawCard from '../../drawcard.js';

class Bronn extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of Bronn',
            phase: 'marshal',
            anyPlayer: true,
            cost: ability.costs.payGold(1),
            handler: (context) => {
                this.game.addMessage(
                    '{0} pays 1 gold to take control of {1}',
                    context.player,
                    this
                );

                this.game.takeControl(context.player, this);
            }
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
