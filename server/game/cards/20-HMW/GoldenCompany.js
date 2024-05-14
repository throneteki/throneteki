import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class GoldenCompany extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasToken(Tokens.gold),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCardReturnedToHand: (event) =>
                    event.allowSave &&
                    event.card.getType() === 'character' &&
                    event.card.hasTrait('Mercenary') &&
                    event.card.location === 'play area' &&
                    event.card.owner === this.controller //check for owner of the returned card in case mercenary card got stolen by the opponent
            },
            cost: ability.costs.discardGold(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to save {2}',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

GoldenCompany.code = '20031';

export default GoldenCompany;
