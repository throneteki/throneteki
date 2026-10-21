import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ArstanWhitebeard extends DrawCard {
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
