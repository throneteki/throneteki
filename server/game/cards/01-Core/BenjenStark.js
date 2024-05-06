import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BenjenStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasTrait('Ranger'),
            effect: ability.effects.cannotBeBypassedByStealth()
        });
        this.interrupt({
            when: {
                onCharacterKilled: (event) =>
                    event.card === this && this.controller.canGainFactionPower()
            },
            message:
                '{player} uses {source} to gain 2 power for their faction and shuffles {source} back into their deck instead of placing him in their dead pile',
            handler: (context) => {
                this.game.addPower(this.controller, 2);
                context.replaceChildEvent(
                    'placeCard',
                    GameActions.shuffleIntoDeck({ cards: [this], allowSave: false }).createEvent()
                );
            }
        });
    }
}

BenjenStark.code = '01122';

export default BenjenStark;
