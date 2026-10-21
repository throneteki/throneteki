import DrawCard from '../../drawcard.js';

class MutinyAtCrastersKeep extends DrawCard {
    // Mutiny At Craster's Keep (06086)
    // Dominance Action: Choose a character with the highest printed cost among characters you
    // control. Sacrifice that character to choose a character an opponent controls and discard it
    // from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard character from play',
            phase: 'dominance',
            cost: ability.costs.sacrifice(
                (card) =>
                    card.getType() === 'character' &&
                    card.getPrintedCost() === this.getHighestCharacterCost()
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller !== this.controller &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                context.target.owner.discardCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} and sacrifices {2} to discard {3} from play',
                    context.player,
                    this,
                    context.costs.sacrifice,
                    context.target
                );
            }
        });
    }

    getHighestCharacterCost() {
        let charactersInPlay = this.controller.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.hasPrintedCost()
        );
        let costs = charactersInPlay.map((card) => card.getPrintedCost());
        return Math.max(...costs);
    }
}

MutinyAtCrastersKeep.code = '06086';

export default MutinyAtCrastersKeep;
