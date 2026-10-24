import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class XaroXhoanDaxos extends DrawCard {
    // Xaro Xhoan Daxos (04093)
    // Reaction: After you marshal a unique attachment, gain 2 gold. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.getType() === 'attachment' &&
                    event.card.isUnique() &&
                    event.playingType === 'marshal' &&
                    event.card.controller === context.source.controller &&
                    context.source.controller.canGainGold()
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

XaroXhoanDaxos.code = '04093';

export default XaroXhoanDaxos;
