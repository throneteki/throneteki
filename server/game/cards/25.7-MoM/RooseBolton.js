const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class RooseBolton extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: card => card.getType() === 'character' && card.isLoyal(),
            effect: ability.effects.cannotBeSaved()
        });
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: { type: 'character', location: 'play area', loyal: true, controller: 'choosingPlayer' }
            },
            message: '{player} is forced by {source} to kill {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(context =>
                        context.targets.getTargets().map(card => GameActions.kill({ card }))
                    ),
                    context
                );
            }
        });
    }
}

RooseBolton.code = '25561';
RooseBolton.version = '1.2';

module.exports = RooseBolton;
