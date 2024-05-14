const DrawCard = require('../../drawcard.js');

class DeadlyKhalasar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give character +STR and intimidate',
            condition: () => this.game.isDuringChallenge(),
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.isFaction('targaryen') &&
                    card.isAttacking()
            },
            handler: (context) => {
                let strBoost = this.getNumberOfDothraki();
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyStrength(strBoost),
                        ability.effects.addKeyword('intimidate')
                    ]
                }));

                this.game.addMessage(
                    '{0} plays {1} to give {2} +{3} STR and intimidate until the end of the challenge',
                    context.player,
                    this,
                    context.target,
                    strBoost
                );
            }
        });
    }

    getNumberOfDothraki() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('dothraki')
        );
    }
}

DeadlyKhalasar.code = '00015';

module.exports = DeadlyKhalasar;
