import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordOfWinterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', trait: 'Lord' });

        this.whileAttached({
            condition: () =>
                this.game.getPlayers().some((player) => player.activePlot.hasTrait('Winter')),
            effect: ability.effects.addKeyword('insight')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.controller.anyCardsInPlay(
                        (card) =>
                            card.isParticipating() &&
                            card.isLoyal() &&
                            card.getType() === 'character'
                    )
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to have {parent} gain 1 power',
                args: { parent: () => this.parent }
            },
            gameAction: GameActions.gainPower(() => ({ card: this.parent }))
        });
    }
}

LordOfWinterfell.code = '27012';

export default LordOfWinterfell;
