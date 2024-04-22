const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheDornishmansWife extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card.isUnique()
            },
            max: ability.limit.perPhase(1),
            message: '{player} plays {source} and {gameAction}',
            gameAction: GameActions.simultaneously(context => [
                ...(context.event.card.hasIcon('military') ? [GameActions.gainGold(context => ({ player: context.player, amount: 2 }))] : []),
                ...(context.event.card.hasIcon('intrigue') ? [GameActions.drawCards(context => ({ player: context.player, amount: 2 }))] : []),
                ...(context.event.card.hasIcon('power') ? [GameActions.gainPower(context => ({ card: context.event.card, amount: 2 }))] : [])
            ])
        });
    }
}

TheDornishmansWife.code = '17145';

module.exports = TheDornishmansWife;
