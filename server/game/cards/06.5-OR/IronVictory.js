import DrawCard from '../../drawcard.js';

class IronVictory extends DrawCard {
    // Iron Victory (06092)
    // While you control Victarion Greyjoy, he gets +1 STR for each power he has.
    // Reaction: After a [greyjoy] character is saved, that character gains 1 power. (Limit twice
    // per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Victarion Greyjoy',
            effect: ability.effects.dynamicStrength(() => this.getPowerOnVictarion())
        });
        this.reaction({
            when: {
                onCardSaved: (event) =>
                    event.card.isFaction('greyjoy') &&
                    event.card.getType() === 'character' &&
                    event.card.allowGameAction('gainPower')
            },
            limit: ability.limit.perPhase(2),
            handler: (context) => {
                context.event.card.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to gain 1 power on {2}',
                    this.controller,
                    this,
                    context.event.card
                );
            }
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
