import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerBarristanSelmy extends DrawCard {
    // Ser Barristan Selmy (02107)
    // Renown.
    // Interrupt: When a Lord or Lady character you control would be killed, stand Ser Barristan
    // Selmy to save that character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    context.source.isControlledLordOrLady(event.card)
            },
            cost: ability.costs.standSelf(),
            message: {
                format: '{player} stands {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }

    isControlledLordOrLady(card) {
        return (
            card.controller === this.controller && (card.hasTrait('Lord') || card.hasTrait('Lady'))
        );
    }
}

SerBarristanSelmy.code = '02107';

export default SerBarristanSelmy;
