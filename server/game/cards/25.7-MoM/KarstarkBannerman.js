const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class KarstarkBannerman extends DrawCard {
    setupCardAbilities() {
        this.forcedinterrupt({
            when: {
                onCharacterKilled: event => event.card === this,
                onSacrificed: event => event.card === this
            },
            target: {
                activePromptTitle: 'Select a location',
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: { type: 'location', location: 'play area', controller: 'choosingPlayer', condition: card => GameActions.gainPower({ card, amount: 1 }).allow() }
            },
            message: '{player} uses {source} to have each player choose a location they control to gain 1 power, if able',
            handler: context => {
                context.game.resolveGameAction(GameActions.simultaneously(context => context.targets.getTargets().map(card => GameActions.gainPower({ card, amount: 1 }))), context);
            }
        });
    }
}

KarstarkBannerman.code = '25566';
KarstarkBannerman.version = '1.1';

module.exports = KarstarkBannerman;
