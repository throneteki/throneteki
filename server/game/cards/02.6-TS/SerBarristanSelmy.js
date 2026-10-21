import DrawCard from '../../drawcard.js';

class SerBarristanSelmy extends DrawCard {
    // Ser Barristan Selmy (02107)
    // Renown.
    // Interrupt: When a Lord or Lady character you control would be killed, stand Ser Barristan
    // Selmy to save that character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.canBeSaved() &&
                    this.isControlledLordOrLady(event.card)
            },
            cost: ability.costs.standSelf(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} stands {1} to save {2}',
                    this.controller,
                    this,
                    context.event.card
                );
            }
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
