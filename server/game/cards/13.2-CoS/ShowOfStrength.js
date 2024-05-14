const DrawCard = require('../../drawcard');

class ShowOfStrength extends DrawCard {
    setupCardAbilities() {
        this.action({
            phase: 'challenge',
            condition: () => this.getLowStrengthCharacters().length > 0,
            message: {
                format: '{player} plays {source} to treat {lowStrengthCharacters} as blank',
                args: { lowStrengthCharacters: () => this.getLowStrengthCharacters() }
            },
            handler: () => {
                let characters = this.getLowStrengthCharacters();

                this.untilEndOfPhase((ability) => ({
                    match: characters,
                    effect: ability.effects.blankExcludingTraits
                }));
            }
        });
    }

    getLowStrengthCharacters() {
        return this.game.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.getStrength() <= 3
        );
    }
}

ShowOfStrength.code = '13024';

module.exports = ShowOfStrength;
