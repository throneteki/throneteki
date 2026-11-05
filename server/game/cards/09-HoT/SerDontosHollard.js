import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerDontosHollard extends DrawCard {
    // Ser Dontos Hollard (09035)
    // No attachments except Weapon.
    // Interrupt: When a Lady character would be killed or discarded from play, stand Ser Dontos
    // Hollard to save that character.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event, context) =>
                    event.allowSave && event.card.canBeSaved() && context.source.isLady(event.card),
                onCardDiscarded: (event, context) =>
                    event.allowSave && event.card.canBeSaved() && context.source.isLady(event.card)
            },
            cost: ability.costs.standSelf(),
            message: {
                format: '{player} stands {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }

    isLady(card) {
        return card.location === 'play area' && card.hasTrait('Lady');
    }
}

SerDontosHollard.code = '09035';

export default SerDontosHollard;
