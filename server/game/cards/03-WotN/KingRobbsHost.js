import DrawCard from '../../drawcard.js';

class KingRobbsHost extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    event.challenge.loser.faction.power >= 1
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Choose an attacking character',
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        card.isAttacking(),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(p, card) {
        let loser = this.game.currentChallenge.loser;
        let power = 0;

        if (loser.faction.power >= 2) {
            power = this.game.anyPlotHasTrait('War') ? 2 : 1;
        } else {
            power = 1;
        }

        this.game.movePower(loser.faction, card, power);

        this.game.addMessage(
            "{0} uses {1} to move {2} power from {3}'s faction card to {4}",
            this.controller,
            this,
            power,
            loser,
            card
        );

        return true;
    }
}

KingRobbsHost.code = '03001';

export default KingRobbsHost;
