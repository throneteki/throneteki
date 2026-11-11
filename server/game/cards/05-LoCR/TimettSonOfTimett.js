import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TimettSonOfTimett extends DrawCard {
    // Timett Son of Timett (05004)
    // Reaction: After you win a challenge in which Timett Son of Timett is attacking, choose and
    // kill a character with printed cost X or lower. X is the number of Clansman characters you
    // control.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking()
            },
            target: {
                activePromptTitle: 'Select character to kill',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= context.source.getNumberOfClansmen(),
                gameAction: 'kill'
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }

    getNumberOfClansmen() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return card.hasTrait('Clansman') && card.getType() === 'character';
        });

        return cards.length;
    }
}

TimettSonOfTimett.code = '05004';

export default TimettSonOfTimett;
