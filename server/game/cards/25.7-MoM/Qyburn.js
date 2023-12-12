const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Qyburn extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            target: {
                cardCondition: { type: 'character', location: 'dead pile', not: { trait: 'Army' }, controller: 'opponent', condition: (card, context) => GameActions.putIntoPlay({ card, player: context.player }).allow() }
            },
            message: '{player} uses {source} to put {target} into play under their control',
            handler: context => {
                context.game.resolveGameAction(GameActions.putIntoPlay(context => ({ card: context.target, player: context.player })), context);

                this.atEndOfPhase(ability => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.removeFromGame()
                }));
            }
        });
    }
}

Qyburn.code = '25527';
Qyburn.version = '1.1';

module.exports = Qyburn;
