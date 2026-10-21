import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Esgred extends DrawCard {
    setupCardAbilities(ability) {
        this.stateCheck({
            condition: (context) => !!this.getAsha(context.player),
            message: '{player} sacrifices {source} as they control Asha Greyjoy',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source })).then({
                condition: (context) => !!this.getAsha(context.player),
                message: {
                    format: 'Then, {asha} gains 1 power',
                    args: { asha: (context) => this.getAsha(context.player) }
                },
                gameAction: GameActions.gainPower((context) => ({
                    card: this.getAsha(context.player),
                    amount: 1
                }))
            })
        });

        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyKeywordTriggerAmount('stealth', 1)
        });
    }

    getAsha(player) {
        return player.cardsInPlay.find(
            (card) => card.name === 'Asha Greyjoy' && card.getType() === 'character'
        );
    }
}

Esgred.code = '04111';

export default Esgred;
