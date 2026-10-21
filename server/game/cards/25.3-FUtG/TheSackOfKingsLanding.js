import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheSackOfKingsLanding extends PlotCard {
    // The Sack of King's Landing (25046)
    // During [intrigue] challenges, each [lannister] character you control gains pillage.
    // Reaction: After a location enters an opponent's discard pile, that player must choose and
    // kill a character they control with the same printed cost.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.isDuringChallenge({ challengeType: 'intrigue' }),
            match: (card) => card.getType() === 'character' && card.isFaction('lannister'),
            effect: ability.effects.addKeyword('pillage')
        });

        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.card.getType() === 'location' &&
                    event.card.controller !== context.source.controller &&
                    event.location === 'discard pile' &&
                    event.card.hasPrintedCost()
            },
            target: {
                choosingPlayer: (player, context) => player === context.event.card.controller,
                cardCondition: (card, context) =>
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.hasPrintedCost() &&
                    card.getPrintedCost() === context.event.card.getPrintedCost(),
                gameAction: 'kill'
            },
            message: {
                format: '{player} uses {source} to have {choosingPlayer} choose and kill {target}',
                args: { choosingPlayer: (context) => context.choosingPlayer }
            },
            gameAction: GameActions.kill((context) => ({
                card: context.target,
                player: context.choosingPlayer
            }))
        });
    }
}

TheSackOfKingsLanding.code = '25046';

export default TheSackOfKingsLanding;
