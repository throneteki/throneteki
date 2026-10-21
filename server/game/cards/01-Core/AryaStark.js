import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AryaStark extends DrawCard {
    // Arya Stark (01141)
    // Stealth.
    // While Arya Stark has a duplicate, she gains a [military] icon.
    // Reaction: After Arya Stark enters play, place the top card of your deck on her facedown as a
    // duplicate.
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
