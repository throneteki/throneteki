import DrawCard from '../../drawcard.js';

class SerLancelLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: () => true,
            match: (card) =>
                (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                card.getType() === 'character' &&
                card.getPower() > 0,
            effect: ability.effects.doesNotContributeToPowerTotal()
        });

        this.action({
            title: 'Put a character into play',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    context.player === card.controller &&
                    card.hasTrait('The Seven') &&
                    ['hand', 'discard pile'].includes(card.location) &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play from their {3}',
                    context.player,
                    this,
                    context.target,
                    context.target.location
                );
                context.player.putIntoPlay(context.target);
            }
        });
    }
}

SerLancelLannister.code = '00152';

export default SerLancelLannister;
