import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RedwyneFleet extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Paxter Redwyne',
            effect: [
                ability.effects.addTrait('Commander'),
                ability.effects.addIcon('military'),
                ability.effects.addIcon('power')
            ]
        });

        this.reaction({
            when: {
                onCardKneeled: (event, context) =>
                    event.card.hasTrait('House Redwyne') && event.card.controller === context.player
            },
            limit: ability.limit.perRound(3),
            condition: (context) => context.player.canGainGold(),
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: 1
            })),
            message: '{player} uses {source} to gain 1 gold'
        });
    }
}

RedwyneFleet.code = '21022';

export default RedwyneFleet;
