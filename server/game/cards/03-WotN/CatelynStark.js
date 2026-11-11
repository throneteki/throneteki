import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CatelynStark extends DrawCard {
    // Catelyn Stark (03002)
    // Catelyn Stark gets +1 STR for each power she has.
    // Reaction: After a [stark] character you control is sacrificed or killed, Catelyn Stark gains
    // 1 power. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event, context) =>
                    context.source.starkCharacterSacrificedOrKilled(event.cardStateWhenSacrificed),
                onCharacterKilled: (event, context) =>
                    context.source.starkCharacterSacrificedOrKilled(event.cardStateWhenKilled)
            },
            limit: ability.limit.perRound(2),
            message:
                '{player} gains 1 power on {source} in reaction to a stark character being sacrificed or killed',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) => context.source.power)
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
