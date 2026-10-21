import DrawCard from '../../drawcard.js';

class SerDontosHollard extends DrawCard {
    // Ser Dontos Hollard (09035)
    // No attachments except Weapon.
    // Interrupt: When a Lady character would be killed or discarded from play, stand Ser Dontos
    // Hollard to save that character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave && event.card.canBeSaved() && this.isLady(event.card),
                onCardDiscarded: (event) =>
                    event.allowSave && event.card.canBeSaved() && this.isLady(event.card)
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

    isLady(card) {
        return card.location === 'play area' && card.hasTrait('Lady');
    }
}

SerDontosHollard.code = '09035';

export default SerDontosHollard;
