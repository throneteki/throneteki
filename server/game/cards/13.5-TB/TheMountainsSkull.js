import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheMountainsSkull extends DrawCard {
    // The Mountain's Skull (13096)
    // Attached character gets +2 STR and gains renown.
    // Reaction: After an opponent's character with printed STR 6 or higher is killed, put The
    // Mountain's Skull into play from your hand or discard pile.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
        });
        this.reaction({
            location: ['hand', 'discard pile'],
            when: {
                onCharacterKilled: (event, context) =>
                    event.card.controller !== context.source.controller &&
                    event.card.getPrintedStrength() >= 6 &&
                    context.source.controller.canPutIntoPlay(context.source)
            },
            message: '{player} uses {source} to put {source} into play.',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

TheMountainsSkull.code = '13096';

export default TheMountainsSkull;
