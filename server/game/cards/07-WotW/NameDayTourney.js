import PlotCard from '../../plotcard.js';

class NameDayTourney extends PlotCard {
    // Name Day Tourney (07051)
    // Reaction: After you win a challenge in which a Knight character you control is attacking or
    // defending alone, choose a Lord or Lady character you control and have it gain 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.hasParticipatingKnight() &&
                    this.hasSingleParticipatingChar()
            },
            target: {
                activePromptTitle: 'Select Lord or Lady',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            handler: (context) => {
                context.target.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    context.target
                );
            }
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
