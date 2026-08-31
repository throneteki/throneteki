import DrawCard from '../../drawcard.js';

class TheTowerOfJoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({
                    match: (challenge) => challenge.hasSingleParticipant(this.controller)
                }),
            match: (card) =>
                card.isUnique() &&
                card.getType() === 'character' &&
                card.isParticipating() &&
                !this.kneeled,
            effect: ability.effects.modifyStrength(2)
        });

        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.isUnique() &&
                    this.allowGameAction('gainPower')
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.addMessage(
                    '{0} gains 1 power from a unique character being killed',
                    this.controller
                );

                this.modifyPower(1);
            }
        });
    }
}

TheTowerOfJoy.code = '00300';

export default TheTowerOfJoy;
