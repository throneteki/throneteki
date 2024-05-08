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
                cardCondition: (card, context) => card.isMatch({ location: 'play area', type: 'character', controller: context.event.challenge.loser }) && GameActions.kneelCard({ card }).allow()
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to kneel {target}',
            handler: context => {
                this.game.resolveGameAction(GameActions.kneelCard(context => ({ card: context.target })), context);
            }
        });
    }
}

TheLaughingStorm.code = '25042';

module.exports = TheLaughingStorm;
