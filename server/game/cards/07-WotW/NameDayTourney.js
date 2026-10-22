import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class NameDayTourney extends PlotCard {
    // Name Day Tourney (07051)
    // Reaction: After you win a challenge in which a Knight character you control is attacking or
    // defending alone, choose a Lord or Lady character you control and have it gain 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.hasParticipatingKnight() &&
                    context.source.hasSingleParticipatingChar()
            },
            target: {
                activePromptTitle: 'Select Lord or Lady',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            message: '{player} uses {source} to have {target} gain 1 power',
            gameAction: GameActions.gainPower((context) => ({ card: context.target, amount: 1 }))
        });
    }

    hasParticipatingKnight() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return (
                card.isParticipating() && card.hasTrait('Knight') && card.getType() === 'character'
            );
        });

        return cards.length >= 1;
    }

    hasSingleParticipatingChar() {
        if (this.game.currentChallenge.attackingPlayer === this.controller) {
            return this.game.currentChallenge.attackers.length === 1;
        }
        return this.game.currentChallenge.defenders.length === 1;
    }
}

NameDayTourney.code = '07051';

export default NameDayTourney;
