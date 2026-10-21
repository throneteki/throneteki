import DrawCard from '../../drawcard.js';

class JeynePoole extends DrawCard {
    // Jeyne Poole (07033)
    // Marshaling Action: Sacrifice Jeyne Poole to return a Lady character from your discard pile to
    // your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice Jeyne Poole',
            phase: 'marshal',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.player &&
                    card.hasTrait('Lady') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                context.player.moveCard(context.target, 'hand');
                this.game.addMessage(
                    '{0} sacrifices {1} to move {2} from their discard pile to their hand',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

JeynePoole.code = '07033';

export default JeynePoole;
