import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ChatayasBrothel extends DrawCard {
    // Chataya's Brothel (04090)
    // Marshaling Action: Kneel a character with an [intrigue] icon to gain 1 gold. (Limit twice per
    // phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            limit: ability.limit.perPhase(2),
            condition: (context) => context.source.controller.canGainGold(),
            cost: ability.costs.kneel((card) => card.hasIcon('intrigue')),
            message: '{player} uses {source} and kneels {costs.kneel} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

ChatayasBrothel.code = '04090';

export default ChatayasBrothel;
