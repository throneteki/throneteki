import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IronVictory extends DrawCard {
    // Iron Victory (06092)
    // While you control Victarion Greyjoy, he gets +1 STR for each power he has.
    // Reaction: After a [greyjoy] character is saved, that character gains 1 power. (Limit twice
    // per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Victarion Greyjoy',
            effect: ability.effects.dynamicStrength((card, context) =>
                context.source.getPowerOnVictarion()
            )
        });
        this.reaction({
            when: {
                onCardSaved: (event) =>
                    event.card.isFaction('greyjoy') &&
                    event.card.getType() === 'character' &&
                    event.card.allowGameAction('gainPower')
            },
            limit: ability.limit.perPhase(2),
            message: {
                format: '{player} uses {source} to gain 1 power on {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.event.card,
                amount: 1
            }))
        });
    }

    getPowerOnVictarion() {
        let card = this.controller.cardsInPlay.find((card) => card.name === 'Victarion Greyjoy');

        if (!card) {
            return 0;
        }

        return card.getPower();
    }
}

IronVictory.code = '06092';

export default IronVictory;
