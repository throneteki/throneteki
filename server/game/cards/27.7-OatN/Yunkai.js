import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Yunkai extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromHand()],
            message: {
                format: '{player} kneels {costs.kneel} and discards {costs.discardFromHand} from their hand to give {characters} -1 STR until the end of the phase',
                args: { characters: () => this.getCharactersWithoutAttachments() }
            },
            gameAction: GameActions.genericHandler(() => {
                this.untilEndOfPhase((ability) => ({
                    match: this.getCharactersWithoutAttachments(),
                    effect: ability.effects.modifyStrength(-1)
                }));
            })
        });
    }

    getCharactersWithoutAttachments() {
        return this.game.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.attachments.length === 0
        );
    }
}

Yunkai.code = '27527';
Yunkai.version = '1.0.0';

export default Yunkai;
