import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AryaStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.dupes.length >= 1,
            match: this,
            effect: ability.effects.addIcon('military')
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.card.canBeDuplicated()
            },
            gameAction: GameActions.placeAsDuplicate((context) => ({
                card: context.player.drawDeck[0],
                parent: context.source,
                facedown: true
            }))
        });
    }
}

AryaStark.code = '01141';

export default AryaStark;
