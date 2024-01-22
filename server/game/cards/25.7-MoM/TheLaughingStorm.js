const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TheLaughingStorm extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', faction: 'baratheon', controller: 'current', unique: true });
        this.persistentEffect({
            condition: () => !this.kneeled,
            targetLocation: 'hand',
            effect: ability.effects.cannotBeDiscardedAtRandom()
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && GameActions.kneelCard({ card }).allow()
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to kneel {target}',
            handler: context => {
                this.game.resolveGameAction(GameActions.kneelCard(context => ({ card: context.target })), context);
            }
        });
    }
}

TheLaughingStorm.code = '25509';
TheLaughingStorm.version = '1.3';

module.exports = TheLaughingStorm;
