import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class QuentynMartell extends DrawCard {
    // Quentyn Martell (03031)
    // While you are not the first player, Quentyn Martell gets +1 STR and gains stealth.
    // Interrupt: When Quentyn Martell is killed, choose and kill a character with a lower STR than
    // his.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.controller.firstPlayer,
            match: this,
            effect: [ability.effects.modifyStrength(1), ability.effects.addKeyword('Stealth')]
        });
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() < context.source.getStrength(),
                gameAction: 'kill'
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

QuentynMartell.code = '03031';

export default QuentynMartell;
