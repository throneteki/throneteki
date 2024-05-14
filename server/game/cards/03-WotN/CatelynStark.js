import DrawCard from '../../drawcard.js';

class CatelynStark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event) =>
                    this.starkCharacterSacrificedOrKilled(event.cardStateWhenSacrificed),
                onCharacterKilled: (event) =>
                    this.starkCharacterSacrificedOrKilled(event.cardStateWhenKilled)
            },
            limit: ability.limit.perRound(2),
            handler: () => {
                this.game.addMessage(
                    '{0} gains 1 power on {1} in reaction to a {2} character being sacrificed or killed',
                    this.controller,
                    this,
                    'stark'
                );
                this.modifyPower(1);
            }
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.power)
        });
    }

    starkCharacterSacrificedOrKilled(card) {
        return (
            this.controller === card.controller &&
            this.allowGameAction('gainPower') &&
            card.isFaction('stark') &&
            card.getType() === 'character'
        );
    }
}

CatelynStark.code = '03002';

export default CatelynStark;
