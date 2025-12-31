import DrawCard from '../../drawcard.js';

class TheodanTheTrue extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave &&
                    event.card.hasTrait('Army') &&
                    event.card.controller === this.controller &&
                    event.card.canBeSaved()
            },
            cost: ability.costs.discardPowerFromSpecific(1, (context) => context.event.card),
            message: {
                format: '{player} uses {source} and discards 1 power from {character} to save {character}',
                args: { character: (context) => context.event.card }
            },
            handler: (context) => {
                context.event.saveCard();
            }
        });
    }
}

TheodanTheTrue.code = '27597';
TheodanTheTrue.version = '1.0.0';

export default TheodanTheTrue;
