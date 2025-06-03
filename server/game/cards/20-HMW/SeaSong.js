import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SeaSong extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'The Reader',
            effect: ability.effects.addKeyword('insight')
        });

        this.reaction({
            when: {
                onCardDiscarded: {
                    aggregateBy: (event) => ({
                        controller: event.cardStateWhenDiscarded.controller,
                        source: event.source
                    }),
                    condition: (aggregate) => aggregate.source === 'reserve'
                }
            },
            limit: ability.limit.perRound(2),
            choices: {
                'Draw 1 card': {
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                },
                'Gain 1 power': {
                    message: '{player} uses {source} to gain 1 power for their faction',
                    gameAction: GameActions.gainPower((context) => ({
                        card: context.player.faction,
                        amount: 1
                    }))
                }
            }
        });
    }
}

SeaSong.code = '20007';

export default SeaSong;
