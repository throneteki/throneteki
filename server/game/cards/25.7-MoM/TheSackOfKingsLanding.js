const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class TheSackOfKingsLanding extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'intrigue' }),
            match: card => card.getType() === 'character' && card.isFaction('lannister'),
            effect: ability.effects.addKeyword('pillage')
        });

        this.reaction({
            when: {
                onCardPlaced: event => event.card.getType() === 'location' && event.card.controller !== this.controller && event.location === 'discard pile' && event.card.hasPrintedCost()
            },
            target: {
                choosingPlayer: (player, context) => player === context.event.card.controller,
                cardCondition: (card, context) => card.controller === context.choosingPlayer && card.getType() === 'character' && card.location === 'play area' 
                    && card.hasPrintedCost() && card.getPrintedCost() === context.event.card.getPrintedCost(),
                gameAction: 'kill'
            },
            message: {
                format: '{player} uses {source} to have {choosingPlayer} choose and kill {target}',
                args: { choosingPlayer: context => context.choosingPlayer }
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.kill(context => ({ card: context.target, player: context.choosingPlayer }))
                    , context
                );
            }
        });
    }
}

TheSackOfKingsLanding.code = '25536';
TheSackOfKingsLanding.version = '1.1';

module.exports = TheSackOfKingsLanding;
