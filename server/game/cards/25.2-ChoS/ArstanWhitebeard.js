import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArstanWhitebeard extends DrawCard {
    // Arstan Whitebeard (25033)
    // If you control Ser Barristan Selmy, sacrifice Arstan Whitebeard.
    // While you control no Lord or Lady characters, Arstan Whitebeard cannot kneel.
    setupCardAbilities(ability) {
        this.stateCheck({
            condition: (context) =>
                context.player.anyCardsInPlay({ type: 'character', name: 'Ser Barristan Selmy' }),
            message: '{player} sacrifices {source} as they control Ser Barristan Selmy',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });

        this.persistentEffect({
            condition: () =>
                !this.controller.anyCardsInPlay({ type: 'character', trait: ['Lord', 'Lady'] }),
            match: this,
            effect: ability.effects.cannotBeKneeled()
        });
    }
}

ArstanWhitebeard.code = '25033';

export default ArstanWhitebeard;
