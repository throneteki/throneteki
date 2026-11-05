import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Bronn extends DrawCard {
    // Bronn (02089)
    // During a challenge in which you are the defending player, Bronn gains a [military], an
    // [intrigue], and a [power] icon.
    // Marshaling Action: Pay 1 gold to take control of Bronn. (Any player may initiate this
    // ability.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of Bronn',
            phase: 'marshal',
            anyPlayer: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to take control of {source}',
            gameAction: GameActions.takeControl((context) => ({
                player: context.player,
                card: context.source
            }))
        });
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({ defendingPlayer: context.source.controller }),
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
