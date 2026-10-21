import DrawCard from '../../drawcard.js';

class SerHorasRedwyne extends DrawCard {
    // Ser Horas Redwyne (02063)
    // Reaction: After Ser Horas Redwyne is knelt, choose and stand a Lady character.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Lady')
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
                this.controller.standCard(context.target);
            }
        });
    }
}

SerHorasRedwyne.code = '02063';

export default SerHorasRedwyne;
