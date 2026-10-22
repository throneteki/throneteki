import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerHorasRedwyne extends DrawCard {
    // Ser Horas Redwyne (02063)
    // Reaction: After Ser Horas Redwyne is knelt, choose and stand a Lady character.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Lady')
            },
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

SerHorasRedwyne.code = '02063';

export default SerHorasRedwyne;
